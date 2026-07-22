const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Patient = require('./models/Patient');
const Review = require('./models/Review');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve the 'uploads' folder publicly so frontend can access PDFs
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure required directories exist
const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('[Server] Connected to MongoDB.'))
    .catch(err => console.error('[Server] MongoDB connection error:', err));

// --- MULTER CONFIGURATION (The PDF Uploader) ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOADS_DIR);
    },
    filename: (req, file, cb) => {
        // Create unique filename: "record-12345-checklist.pdf"
        const uniqueName = `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

const upload = multer({ storage: storage });

// --- AUTHENTICATION ROUTES --- SIGNUP AND LOGIN

app.post('/api/signup', async (req, res) => {
    console.log('--- SIGNUP ATTEMPT ---', req.body);
    const { name, cnic, password, age, gender, phone } = req.body;

    // Basic Validation
    if (!cnic || !password || !name) {
        console.log('Signup failed: Missing fields');
        return res.status(400).json({ message: 'Missing fields' });
    }

    try {
        // Check if CNIC already exists in MongoDB
        const existingPatient = await Patient.findById(cnic);
        if (existingPatient) {
            console.log('Signup failed: CNIC exists in MongoDB');
            return res.status(400).json({ message: 'An account with this CNIC already exists. Please log in instead.' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create patient in MongoDB
        const newPatient = new Patient({
            _id: cnic, // CNIC acts as Primary Key (_id)
            name,
            password: hashedPassword,
            age,
            gender,
            phone,
            medicalHistory: [],
            testReports: [],
            diseaseNodes: [],
            createdAt: new Date()
        });

        await newPatient.save();
        console.log('Signup SUCCESS for:', cnic);
        res.json({ success: true, message: "Account created" });
    } catch (err) {
        console.error('Signup Error:', err);
        res.status(500).json({ message: 'Internal server error during registration.' });
    }
});

app.post('/api/login', async (req, res) => {
    console.log('--- LOGIN ATTEMPT ---', req.body);
    const { cnic, password } = req.body;

    try {
        // Find user in MongoDB patients collection
        const user = await Patient.findById(cnic);

        // Check credentials
        if (!user) {
            console.log('Login failed: Invalid credentials');
            return res.status(401).json({ message: 'Invalid CNIC or Password' });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            console.log('Login failed: Invalid credentials');
            return res.status(401).json({ message: 'Invalid CNIC or Password' });
        }

        // Send back user info (minus password)
        const userInfo = {
            cnic: user._id,
            name: user.name,
            age: user.age,
            gender: user.gender,
            phone: user.phone,
            role: 'patient',
            createdAt: user.createdAt
        };

        console.log('Login SUCCESS for:', cnic);
        res.json({ success: true, user: userInfo });
    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).json({ message: 'Internal server error during login.' });
    }
});

// --- DATA ACCESS ROUTES ---

app.get('/api/patients/:cnic', async (req, res) => {
    console.log(`--- FETCHING PATIENT DATA: ${req.params.cnic} ---`);
    try {
        const patient = await Patient.findById(req.params.cnic);

        if (!patient) {
            console.log('Patient NOT found in database');
            return res.status(404).json({ message: 'Patient not found' });
        }

        const safePatient = {
            cnic: patient._id,
            name: patient.name,
            age: patient.age,
            gender: patient.gender,
            phone: patient.phone,
            role: 'patient',
            createdAt: patient.createdAt,
            medicalHistory: patient.medicalHistory,
            testReports: patient.testReports,
            diseaseNodes: patient.diseaseNodes
        };

        console.log('Patient found, sending data');
        res.json(safePatient);
    } catch (err) {
        console.error('Fetch Patient Error:', err);
        res.status(500).json({ message: 'Internal server error fetching patient.' });
    }
});

// --- NEW FEATURES: FILE UPLOADS ---

// 1. UPLOAD TEST REPORT (Patient Only Rule Enforced Here)
app.post('/api/patients/:cnic/reports', upload.single('file'), async (req, res) => {
    console.log(`--- REPORT UPLOAD ATTEMPT: ${req.params.cnic} ---`);
    const { cnic } = req.params;
    const { doctorName, disease } = req.body;
    const file = req.file;

    if (!file) {
        console.log('Report rejected: No file provided');
        return res.status(400).json({ message: "PDF File is required" });
    }

    try {
        const patient = await Patient.findById(cnic);
        if (!patient) return res.status(404).json({ message: "Patient not found" });

        const newReport = {
            id: uuidv4(),
            fileName: file.originalname,
            filePath: `/uploads/${file.filename}`,
            uploadDate: new Date(),
            referringDoctor: doctorName || "Self",
            diseaseCause: disease || "General Checkup"
        };

        patient.testReports.push(newReport);
        await patient.save();

        console.log('Report saved successfully');
        res.json(newReport);
    } catch (err) {
        console.error('Upload Report Error:', err);
        res.status(500).json({ message: 'Internal server error uploading report.' });
    }
});

// 2. UPLOAD MEDICAL HISTORY / PRESCRIPTION (Mind-Map Disease-Centric System)
app.post('/api/patients/:cnic/history', upload.fields([{ name: 'prescriptionFile', maxCount: 1 }, { name: 'testReportFile', maxCount: 1 }]), async (req, res) => {
    const { cnic } = req.params;
    console.log(`--- [START] HISTORY LOG: ${cnic} ---`);
    console.log('Incoming Body:', req.body);

    try {
        const patient = await Patient.findById(cnic);
        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }

        const { disease, doctorName, hospitalName, treatment, visitDate, diseaseId, reportName, reportDate } = req.body;

        // Extract files from upload.fields()
        const prescriptionFile = req.files && req.files['prescriptionFile'] ? req.files['prescriptionFile'][0] : null;
        const testReportFile = req.files && req.files['testReportFile'] ? req.files['testReportFile'][0] : null;

        // Safely parse JSON arrays
        let medicines = [];
        try { medicines = req.body.medicines ? JSON.parse(req.body.medicines) : []; } catch (e) { console.error("Med Parse Error", e); }

        let prescribedTests = [];
        try { prescribedTests = req.body.prescribedTests ? JSON.parse(req.body.prescribedTests) : []; } catch (e) { console.error("Test Parse Error", e); }

        // Handle disease node: either link to existing or create new
        let targetDiseaseId = diseaseId;
        if (!targetDiseaseId || targetDiseaseId === 'new') {
            // Create a new disease node
            const newDiseaseNode = {
                id: uuidv4(),
                disease: disease || "General Checkup",
                createdAt: new Date()
            };
            patient.diseaseNodes.push(newDiseaseNode);
            targetDiseaseId = newDiseaseNode.id;
            console.log(`Created new disease node: ${newDiseaseNode.disease} (${newDiseaseNode.id})`);
        }

        const newRecord = {
            id: uuidv4(),
            diseaseId: targetDiseaseId,
            disease: disease || "General Checkup",
            diagnosis: disease || "General Checkup",  // backward compat alias
            treatment: treatment || "",
            doctorName: doctorName || "Doctor",
            hospitalName: hospitalName || "Hospital",
            visitDate: visitDate || new Date().toISOString().split('T')[0],
            date: new Date(),
            medicines: medicines,
            prescribedTests: prescribedTests,
            reportName: reportName || "",
            reportDate: reportDate || "",
            prescriptionAttachment: prescriptionFile ? `/uploads/${prescriptionFile.filename}` : null,
            reportAttachment: testReportFile ? `/uploads/${testReportFile.filename}` : null
        };

        patient.medicalHistory.push(newRecord);

        // If a test report was uploaded, ALSO add it to the standalone testReports array
        // This synchronizes the Clinical Mind-Map with the Lab Reports repository
        if (testReportFile) {
            const newLabReport = {
                id: uuidv4(),
                fileName: testReportFile.originalname,
                filePath: `/uploads/${testReportFile.filename}`,
                uploadDate: reportDate ? new Date(reportDate) : new Date(),
                referringDoctor: doctorName || "Self",
                diseaseCause: reportName || disease || "General Checkup"
            };
            patient.testReports.push(newLabReport);
            console.log(`Synchronized Lab Report: ${newLabReport.diseaseCause}`);
        }

        await patient.save();
        console.log('--- [SUCCESS] Record Synchronized ---');
        res.json(newRecord);
    } catch (err) {
        console.error('Log History Error:', err);
        res.status(500).json({ message: 'Internal server error logging history.' });
    }
});

// 3. DELETE TEST REPORT
app.delete('/api/patients/:cnic/reports/:reportId', async (req, res) => {
    const { cnic, reportId } = req.params;
    console.log(`--- REPORT DELETION REQUEST: ${cnic}, Report: ${reportId} ---`);

    try {
        const patient = await Patient.findById(cnic);
        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }

        const reportIndex = patient.testReports.findIndex(r => r.id === reportId);
        if (reportIndex === -1) {
            return res.status(404).json({ message: "Report not found" });
        }

        patient.testReports.splice(reportIndex, 1);
        await patient.save();
        console.log("Report deleted successfully.");
        res.json({ success: true, message: "Report removed from repository." });
    } catch (err) {
        console.error('Delete Report Error:', err);
        res.status(500).json({ message: 'Internal server error deleting report.' });
    }
});

// 4. DELETE MEDICAL HISTORY RECORD (With duplicate report deletion bug fix)
app.delete('/api/patients/:cnic/history/:historyId', async (req, res) => {
    const { cnic, historyId } = req.params;
    console.log(`--- HISTORY DELETION REQUEST: ${cnic}, Record: ${historyId} ---`);

    try {
        const patient = await Patient.findById(cnic);
        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }

        const historyIndex = patient.medicalHistory.findIndex(h => h.id === historyId);
        if (historyIndex === -1) {
            return res.status(404).json({ message: "Clinical record not found" });
        }

        const historyEntry = patient.medicalHistory[historyIndex];

        // BUG FIX: If there is an attached report file, remove its duplicate from the standalone testReports array
        if (historyEntry.reportAttachment) {
            const originalReportLength = patient.testReports.length;
            patient.testReports = patient.testReports.filter(r => r.filePath !== historyEntry.reportAttachment);
            console.log(`Bug Fix: Removed ${originalReportLength - patient.testReports.length} duplicate report reference(s) from standalone reports list.`);
        }

        patient.medicalHistory.splice(historyIndex, 1);
        await patient.save();
        console.log("History record deleted successfully.");
        res.json({ success: true, message: "Clinical narrative removed." });
    } catch (err) {
        console.error('Delete History Error:', err);
        res.status(500).json({ message: 'Internal server error deleting history.' });
    }
});

// --- NEW FEATURES: REPORT COMPARISON ---

app.post('/api/patients/:cnic/compare-reports', async (req, res) => {
    console.log(`--- REPORT COMPARISON REQUEST: ${req.params.cnic} ---`);
    const { report1Path, report2Path } = req.body;

    if (!report1Path || !report2Path) {
        return res.status(400).json({ message: "Both report paths are required for comparison" });
    }

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

        const fullPath1 = path.join(__dirname, report1Path);
        const fullPath2 = path.join(__dirname, report2Path);

        if (!fs.existsSync(fullPath1) || !fs.existsSync(fullPath2)) {
            return res.status(404).json({ message: "One or both report files not found on server" });
        }

        const getMimeType = (filePath) => {
            const ext = path.extname(filePath).toLowerCase();
            if (ext === '.pdf') return 'application/pdf';
            if (ext === '.png') return 'image/png';
            if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
            return 'application/octet-stream';
        };

        const part1 = {
            inlineData: {
                data: Buffer.from(fs.readFileSync(fullPath1)).toString("base64"),
                mimeType: getMimeType(fullPath1)
            }
        };

        const part2 = {
            inlineData: {
                data: Buffer.from(fs.readFileSync(fullPath2)).toString("base64"),
                mimeType: getMimeType(fullPath2)
            }
        };

        const prompt = `Compare these two medical reports. 
Report 1 is the older report. Report 2 is the newer report.
Extract the key findings, numerical values, and conditions from both.
Provide the output in JSON format exactly as follows:
{
  "summary": "A brief overview of the changes between the two reports",
  "comparisons": [
    { "metric": "e.g., Hemoglobin", "oldValue": "12", "newValue": "14", "status": "improved/worsened/stable/neutral", "notes": "Optional brief note" }
  ],
  "recommendations": ["Any obvious recommendations mentioned in the new report"]
}
Only output the valid JSON without any markdown block formatting or additional text.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [part1, part2, prompt],
            config: {
                responseMimeType: "application/json"
            }
        });

        const jsonText = response.text || response.candidates[0].content.parts[0].text;
        const result = JSON.parse(jsonText);

        res.json({ success: true, data: result });
    } catch (error) {
        console.error("Comparison Error:", error);
        res.status(500).json({ message: "Failed to compare reports. Ensure the AI key is active and files are supported." });
    }
});

// --- NEW FEATURES: COMPREHENSIVE VISIT COMPARISON (REPORTS + PRESCRIPTIONS) ---

app.post('/api/patients/:cnic/compare-visits', async (req, res) => {
    console.log(`--- VISIT COMPARISON REQUEST: ${req.params.cnic} ---`);
    const { visitIds } = req.body;

    if (!visitIds || !Array.isArray(visitIds) || visitIds.length < 2) {
        return res.status(400).json({ message: "At least two visit IDs are required for comparison." });
    }

    try {
        const patient = await Patient.findById(req.params.cnic);

        if (!patient || !patient.medicalHistory) {
            return res.status(404).json({ message: "Patient or medical history not found." });
        }

        // Extract the chronological sequence of selected visits
        const selectedVisits = patient.medicalHistory
            .filter(record => visitIds.includes(record.id))
            .sort((a, b) => new Date(a.date) - new Date(b.date));

        if (selectedVisits.length < 2) {
            return res.status(404).json({ message: "Could not find all selected visits in the database." });
        }

        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

        // --- BUILD INTERLEAVED CONTENT PARTS ---
        const parts = [];
        const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB cap per file

        const getMimeType = (filePath) => {
            const ext = path.extname(filePath).toLowerCase();
            if (ext === '.pdf') return 'application/pdf';
            if (ext === '.png') return 'image/png';
            if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
            return 'application/octet-stream';
        };

        // Collect all doctor names upfront for explicit reference in the prompt
        const doctorNames = selectedVisits.map((v, i) => `Visit ${i + 1}: ${v.doctorName}`).join(', ');

        parts.push({ text: `You are comparing ${selectedVisits.length} chronological medical visits for a patient.\nThe participating doctors are: ${doctorNames}.\n\n` });

        // Process each visit: push text context, then its files inline
        selectedVisits.forEach((visit, index) => {
            let visitText = `--- VISIT ${index + 1} ---\n`;
            visitText += `Doctor Name: ${visit.doctorName}\n`;
            visitText += `Date: ${new Date(visit.date).toLocaleDateString()}\n`;
            visitText += `Hospital: ${visit.hospitalName || "Not specified"}\n`;
            visitText += `Prescribed Medicines:\n`;
            if (visit.medicines && visit.medicines.length > 0) {
                visit.medicines.forEach(med => {
                    visitText += `- ${med.name} (Dosage: ${med.dosage}, Duration: ${med.duration}, Timing: ${med.timing})\n`;
                });
            } else {
                visitText += `- None recorded\n`;
            }
            visitText += `Treatment Notes: ${visit.treatment || "None"}\n`;

            parts.push({ text: visitText });

            const tryAddFile = (filePath, fileDesc) => {
                if (!filePath) return;
                const fullPath = path.join(__dirname, filePath);
                if (!fs.existsSync(fullPath)) {
                    parts.push({ text: `[Note: ${fileDesc} for Visit ${index + 1} was missing on server — skipped]\n` });
                    console.warn(`[Compare] File missing: ${fullPath}`);
                    return;
                }
                try {
                    const stats = fs.statSync(fullPath);
                    if (stats.size > MAX_FILE_SIZE) {
                        parts.push({ text: `[Note: ${fileDesc} for Visit ${index + 1} was too large to process (${(stats.size / 1024 / 1024).toFixed(1)}MB) — skipped]\n` });
                        console.warn(`[Compare] File too large: ${fullPath} (${stats.size} bytes)`);
                        return;
                    }
                    const fileData = fs.readFileSync(fullPath);
                    parts.push({
                        inlineData: {
                            data: fileData.toString("base64"),
                            mimeType: getMimeType(fullPath)
                        }
                    });
                    parts.push({ text: `[The document above is the ${fileDesc} from Visit ${index + 1} by ${visit.doctorName}]\n` });
                } catch (fileErr) {
                    parts.push({ text: `[Note: ${fileDesc} for Visit ${index + 1} could not be read — skipped]\n` });
                    console.error(`[Compare] File read error: ${fullPath}`, fileErr.message);
                }
            };

            tryAddFile(visit.prescriptionAttachment, "Digital Prescription PDF");
            tryAddFile(visit.reportAttachment, "Medical/Lab Test Report");

            if (visit.reportName && !visit.reportAttachment) {
                parts.push({ text: `[Note: Patient mentioned taking a test: ${visit.reportName} on ${visit.reportDate}]\n` });
            }

            parts.push({ text: `\n` });
        });

        parts.push({
            text: `--- INSTRUCTIONS ---
Your task as a senior medical evaluator is to compare these visits. Determine how the patient's treatment strategy evolved.
Did the condition improve or worsen based on the available data, especially the attached Medical/Lab Test Reports? Evaluate the health progression explicitly based on the report data.
Which doctor's treatment approach appears more effective and why?

CRITICAL: The doctors in this comparison are named exactly as follows:
${selectedVisits.map((v, i) => `- Visit ${i + 1}: "${v.doctorName}"`).join('\n')}
You MUST use the exact doctor name as listed above in your "betterTreatment" field. Do NOT invent, abbreviate, or modify the name. Use it verbatim.

Provide the output in JSON format exactly as follows:
{
  "summary": "A brief overview of how the treatment approach changed across the timeline.",
  "reportChanges": [
    { "metric": "e.g., Blood Pressure / Pain Level", "trend": "improved/worsened/stable", "notes": "Optional brief note based on attached reports or notes" }
  ],
  "prescriptionChanges": [
    { "medicine": "e.g., Amoxicillin", "change": "added/removed/dosage increased", "reasoning": "Why you think this change was made" }
  ],
  "betterTreatment": "The exact doctor name from the list above",
  "reasoning": "Why this doctor's treatment was deemed better."
}
Only output the valid JSON without any markdown block formatting or additional text.` });

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [{ role: 'user', parts: parts }],
            config: {
                responseMimeType: "application/json"
            }
        });

        const jsonText = response.text || response.candidates[0].content.parts[0].text;
        const result = JSON.parse(jsonText);

        res.json({ success: true, data: result });
    } catch (error) {
        console.error("Visit Comparison Error:", error);
        res.status(500).json({ message: "Failed to compare visits. Ensure the AI key is active and files are valid." });
    }
});

// --- NEW FEATURE: SINGLE REPORT AI ANALYSIS ---
app.post('/api/patients/:cnic/analyze-report', async (req, res) => {
    console.log(`--- REPORT ANALYSIS REQUEST: ${req.params.cnic} ---`);
    const { reportPath, includeFoodAdvice } = req.body;

    if (!reportPath) {
        return res.status(400).json({ message: "Report path is required for analysis" });
    }

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

        const fullPath = path.join(__dirname, reportPath);
        if (!fs.existsSync(fullPath)) {
            return res.status(404).json({ message: "Report file not found on server" });
        }

        const getMimeType = (filePath) => {
            const ext = path.extname(filePath).toLowerCase();
            if (ext === '.pdf') return 'application/pdf';
            if (ext === '.png') return 'image/png';
            if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
            return 'application/octet-stream';
        };

        const filePart = {
            inlineData: {
                data: Buffer.from(fs.readFileSync(fullPath)).toString("base64"),
                mimeType: getMimeType(fullPath)
            }
        };

        let prompt = `You are a senior clinical pathologist AI. Analyze this medical report thoroughly.

Extract ALL measurable values from the report. For each value, provide:
- The metric name
- The patient's actual value (with unit)
- The normal/recommended range for a healthy adult
- A status: "normal", "low", "high", or "critical"
- A brief clinical note

Then provide:
1. An overall health summary (2-3 sentences)
2. Which specialist doctors the patient should consult based on abnormal values
3. Key warnings or urgent findings

${includeFoodAdvice ? `4. For each abnormal value, suggest specific foods and dietary changes that can help improve it naturally.` : ''}

Return the result in this exact JSON format:
{
  "overallSummary": "Brief 2-3 sentence summary of the patient's health based on this report",
  "values": [
    {
      "metric": "e.g., Hemoglobin",
      "patientValue": "e.g., 10.2 g/dL",
      "normalRange": "e.g., 12.0 - 17.5 g/dL",
      "status": "low",
      "note": "Below normal, indicates possible anemia"
    }
  ],
  "recommendedDoctors": [
    {
      "speciality": "e.g., Hematologist",
      "reason": "e.g., Low hemoglobin and RBC count suggest anemia evaluation needed"
    }
  ],
  "warnings": ["Any urgent or critical findings"],
  "foodRecommendations": ${includeFoodAdvice ? `[
    {
      "forMetric": "e.g., Hemoglobin",
      "foods": ["Spinach", "Red meat", "Lentils", "Pomegranate"],
      "advice": "Brief dietary guidance"
    }
  ]` : '[]'}
}
Only output the valid JSON without any markdown block formatting or additional text.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [filePart, prompt],
            config: {
                responseMimeType: "application/json"
            }
        });

        const jsonText = response.text || response.candidates[0].content.parts[0].text;
        const result = JSON.parse(jsonText);

        res.json({ success: true, data: result });
    } catch (error) {
        console.error("Analysis Error:", error);
        res.status(500).json({ message: "Failed to analyze report. Ensure the AI key is active and the file is a valid medical report." });
    }
});

// --- NEW FEATURES: DOCTOR RATINGS ---

// 1. SUBMIT A REVIEW
app.post('/api/reviews', async (req, res) => {
    console.log('--- REVIEW SUBMISSION ---', req.body);
    const { doctorName, speciality, hospital, rating, remarks, patientName } = req.body;

    if (!doctorName || !rating || !remarks) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        const newReview = new Review({
            id: uuidv4(),
            doctorName,
            speciality: speciality || "General",
            hospital: hospital || "Private Clinic",
            rating: Number(rating),
            remarks,
            patientName: patientName || "Anonymous",
            date: new Date()
        });

        await newReview.save();
        console.log('Review added for:', doctorName);
        res.json(newReview);
    } catch (err) {
        console.error('Submit Review Error:', err);
        res.status(500).json({ message: 'Internal server error submitting review.' });
    }
});

// 2. GET ALL REVIEWS
app.get('/api/reviews', async (req, res) => {
    console.log('--- FETCHING REVIEWS ---');
    try {
        const reviews = await Review.find().sort({ date: -1 });
        res.json(reviews);
    } catch (err) {
        console.error('Fetch Reviews Error:', err);
        res.status(500).json({ message: 'Internal server error fetching reviews.' });
    }
});

// ─── FEATURE 1: AI HEALTH SUMMARY ────────────────────────────────────────────
app.post('/api/patients/:cnic/health-summary', async (req, res) => {
    console.log(`--- HEALTH SUMMARY REQUEST: ${req.params.cnic} ---`);
    try {
        const patient = await Patient.findById(req.params.cnic);
        if (!patient) return res.status(404).json({ message: 'Patient not found' });

        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

        const historySnippet = (patient.medicalHistory || []).map(h => ({
            disease: h.disease || h.diagnosis,
            doctor: h.doctorName,
            date: h.visitDate || h.date,
            treatment: h.treatment,
            medicines: (h.medicines || []).map(m => m.name).join(', '),
        }));

        const prompt = `You are a senior clinical AI. Given a patient's health profile, generate a concise health summary.

Patient:
- Name: ${patient.name}
- Age: ${patient.age}
- Gender: ${patient.gender}
- Total visits: ${historySnippet.length}
- Total lab reports: ${(patient.testReports || []).length}
- Medical history (recent first):
${JSON.stringify(historySnippet.slice(0, 20), null, 2)}

Generate a health summary in this exact JSON format:
{
  "headline": "One sentence summarizing the patient's overall health trajectory",
  "paragraph": "2-3 sentence narrative health brief covering patterns, active conditions, and general status",
  "activeConditions": ["list of disease names currently active or recurring"],
  "riskFlags": ["any patterns that indicate health risk — empty array if none"],
  "positives": ["any positive health indicators or improvements seen"],
  "lastUpdated": "today's date in human-readable format"
}
Only output valid JSON without markdown code fences or extra text.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            config: { responseMimeType: 'application/json' }
        });
        const result = JSON.parse(response.text || response.candidates[0].content.parts[0].text);
        res.json({ success: true, data: result });
    } catch (err) {
        console.error('Health Summary Error:', err);
        res.status(500).json({ message: 'Failed to generate health summary.' });
    }
});

// ─── FEATURE 2: MEDICINE INTERACTION CHECKER ─────────────────────────────────
app.post('/api/patients/:cnic/check-interactions', async (req, res) => {
    console.log(`--- INTERACTION CHECK REQUEST: ${req.params.cnic} ---`);
    const { medicines } = req.body;
    if (!medicines || !Array.isArray(medicines) || medicines.length < 2) {
        return res.status(400).json({ message: 'At least 2 medicines required for interaction check.' });
    }

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

        const medicineList = medicines.map((m, i) => `${i + 1}. ${m.name}${m.dosage ? ` (${m.dosage})` : ''}`).join('\n');

        const prompt = `You are a clinical pharmacologist AI. Check for drug interactions among this list of medicines prescribed together:

${medicineList}

For each interaction found, classify severity as: "mild", "moderate", "severe", or "contraindicated".
If no interactions exist, return an empty interactions array.

Return this exact JSON:
{
  "summary": "One sentence overall assessment",
  "interactions": [
    {
      "drug1": "Medicine name A",
      "drug2": "Medicine name B",
      "severity": "mild/moderate/severe/contraindicated",
      "effect": "What happens when taken together",
      "recommendation": "What the patient/doctor should do"
    }
  ],
  "safe": true or false (true = no severe/contraindicated interactions found)
}
Only output valid JSON without markdown code fences or extra text.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            config: { responseMimeType: 'application/json' }
        });
        const result = JSON.parse(response.text || response.candidates[0].content.parts[0].text);
        res.json({ success: true, data: result });
    } catch (err) {
        console.error('Interaction Check Error:', err);
        res.status(500).json({ message: 'Failed to check medicine interactions.' });
    }
});

// ─── FEATURE 3: DIAGNOSIS SUGGESTION FROM REPORT ─────────────────────────────
app.post('/api/patients/:cnic/diagnosis-suggestion', async (req, res) => {
    console.log(`--- DIAGNOSIS SUGGESTION REQUEST: ${req.params.cnic} ---`);
    const { reportPath } = req.body;
    if (!reportPath) return res.status(400).json({ message: 'Report path is required.' });

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

        const fullPath = path.join(__dirname, reportPath);
        if (!fs.existsSync(fullPath)) return res.status(404).json({ message: 'Report file not found.' });

        const getMimeType = (fp) => {
            const ext = path.extname(fp).toLowerCase();
            if (ext === '.pdf') return 'application/pdf';
            if (ext === '.png') return 'image/png';
            if (['.jpg', '.jpeg'].includes(ext)) return 'image/jpeg';
            return 'application/octet-stream';
        };

        const filePart = {
            inlineData: {
                data: Buffer.from(fs.readFileSync(fullPath)).toString('base64'),
                mimeType: getMimeType(fullPath)
            }
        };

        const prompt = `You are a senior diagnostic physician AI. Analyze this medical lab report and suggest likely conditions or diagnoses based on the values found.

For each likely condition:
- Explain which specific abnormal values point to it
- Rate the confidence: "likely", "possible", or "unlikely but worth monitoring"
- Suggest what specialist to see for confirmation

Return this exact JSON:
{
  "topDiagnosis": "The single most likely condition based on the report",
  "confidence": "likely/possible/uncertain",
  "explanation": "2-3 sentences explaining the reasoning",
  "conditions": [
    {
      "name": "Condition name",
      "confidence": "likely/possible/unlikely but worth monitoring",
      "indicatingValues": ["e.g., Hemoglobin 8.2 g/dL (low)", "RBC 3.1 (low)"],
      "specialist": "Recommended specialist type"
    }
  ],
  "urgency": "routine/soon/urgent",
  "urgencyNote": "Brief note explaining urgency level"
}
Only output valid JSON without markdown code fences or extra text.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [{ role: 'user', parts: [filePart, { text: prompt }] }],
            config: { responseMimeType: 'application/json' }
        });
        const result = JSON.parse(response.text || response.candidates[0].content.parts[0].text);
        res.json({ success: true, data: result });
    } catch (err) {
        console.error('Diagnosis Suggestion Error:', err);
        res.status(500).json({ message: 'Failed to generate diagnosis suggestion.' });
    }
});

// ─── FEATURE 4: TREATMENT TREND ANALYSIS ─────────────────────────────────────
app.post('/api/patients/:cnic/treatment-trend', async (req, res) => {
    console.log(`--- TREATMENT TREND REQUEST: ${req.params.cnic} ---`);
    const { diseaseId } = req.body;
    if (!diseaseId) return res.status(400).json({ message: 'diseaseId is required.' });

    try {
        const patient = await Patient.findById(req.params.cnic);
        if (!patient) return res.status(404).json({ message: 'Patient not found.' });

        const visits = (patient.medicalHistory || [])
            .filter(h => h.diseaseId === diseaseId || h.disease === diseaseId)
            .sort((a, b) => new Date(a.visitDate || a.date) - new Date(b.visitDate || b.date));

        if (visits.length < 2) return res.status(400).json({ message: 'At least 2 visits required for trend analysis.' });

        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

        const visitSummaries = visits.map((v, i) => ({
            visitNumber: i + 1,
            date: v.visitDate || new Date(v.date).toLocaleDateString(),
            doctor: v.doctorName,
            hospital: v.hospitalName,
            treatment: v.treatment,
            medicines: (v.medicines || []).map(m => `${m.name} ${m.dosage || ''}`).join(', ') || 'None',
            tests: (v.prescribedTests || []).join(', ') || 'None',
        }));

        const diseaseName = visits[0].disease || visits[0].diagnosis || 'Unknown condition';

        const prompt = `You are a senior clinical AI evaluating a patient's treatment timeline for: "${diseaseName}".

Here are the chronological visits:
${JSON.stringify(visitSummaries, null, 2)}

Based on the evolution of treatments, medicines, and clinical notes across these visits, provide a trend analysis.

Return this exact JSON:
{
  "trend": "improving/worsening/stable/fluctuating",
  "trendNote": "One sentence summary of the trend",
  "paragraph": "2-3 sentence narrative of how this condition has been managed and how treatment has evolved",
  "milestones": [
    { "visit": 1, "note": "Key observation for this visit" }
  ],
  "medicineEvolution": "One sentence describing how medicines changed across visits",
  "recommendation": "What the AI suggests for next steps based on this pattern"
}
Only output valid JSON without markdown code fences or extra text.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            config: { responseMimeType: 'application/json' }
        });
        const result = JSON.parse(response.text || response.candidates[0].content.parts[0].text);
        res.json({ success: true, data: result });
    } catch (err) {
        console.error('Treatment Trend Error:', err);
        res.status(500).json({ message: 'Failed to analyze treatment trend.' });
    }
});

// ─── FEATURE 5: PRESCRIPTION IMAGE PARSER ────────────────────────────────────
app.post('/api/patients/:cnic/parse-prescription', upload.single('prescriptionImage'), async (req, res) => {
    console.log(`--- PRESCRIPTION PARSE REQUEST: ${req.params.cnic} ---`);
    const file = req.file;
    if (!file) return res.status(400).json({ message: 'Prescription image is required.' });

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

        const getMimeType = (fp) => {
            const ext = path.extname(fp).toLowerCase();
            if (ext === '.pdf') return 'application/pdf';
            if (ext === '.png') return 'image/png';
            if (['.jpg', '.jpeg'].includes(ext)) return 'image/jpeg';
            return 'application/octet-stream';
        };

        const filePart = {
            inlineData: {
                data: Buffer.from(fs.readFileSync(file.path)).toString('base64'),
                mimeType: getMimeType(file.path)
            }
        };

        const prompt = `You are a clinical pharmacist AI. Parse this handwritten or printed medical prescription image.

Extract every medicine listed on it. For each medicine, try to identify:
- Name (as written; correct obvious spelling errors if confident)
- Dosage (e.g., "500mg", "10mg")
- Duration (e.g., "7 days", "2 weeks")
- Timing — map to one or more of: ["Morning", "Afternoon", "Evening", "Night"]
- Any special instructions

Also extract:
- Doctor name (if visible)
- Hospital/clinic name (if visible)
- Diagnosis or condition (if written)
- Date (if written)

Return this exact JSON:
{
  "doctorName": "or null",
  "hospitalName": "or null",
  "diagnosis": "or null",
  "prescriptionDate": "or null",
  "medicines": [
    {
      "name": "Medicine name",
      "dosage": "e.g., 500mg or null",
      "duration": "e.g., 7 days or null",
      "timing": ["Morning", "Night"],
      "instructions": "e.g., take after meals or null"
    }
  ],
  "notes": "Any other information found on the prescription or null"
}
Only output valid JSON without markdown code fences or extra text.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [{ role: 'user', parts: [filePart, { text: prompt }] }],
            config: { responseMimeType: 'application/json' }
        });
        const result = JSON.parse(response.text || response.candidates[0].content.parts[0].text);

        // Clean up the temp uploaded file after parsing
        try { fs.unlinkSync(file.path); } catch (_) { }

        res.json({ success: true, data: result });
    } catch (err) {
        console.error('Prescription Parse Error:', err);
        try { fs.unlinkSync(file.path); } catch (_) { }
        res.status(500).json({ message: 'Failed to parse prescription.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server V2 running on http://localhost:${PORT}`);
});
