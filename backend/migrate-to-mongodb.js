/**
 * migrate-to-mongodb.js
 * Standalone one-time migration utility script.
 * Loads store.json, hashes plaintext passwords, and saves records to MongoDB.
 */

const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const fs = require('fs');
const path = require('path');
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Patient = require('./models/Patient');
const Review = require('./models/Review');

const STORE_FILE = path.join(__dirname, 'data', 'store.json');

async function runMigration() {
    console.log('[Migration] Connecting to MongoDB...');
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('[Migration] Connected to MongoDB successfully.');
    } catch (err) {
        console.error('[Migration] Failed to connect to MongoDB:', err.message);
        process.exit(1);
    }

    if (!fs.existsSync(STORE_FILE)) {
        console.error(`[Migration] Source file not found: ${STORE_FILE}`);
        mongoose.connection.close();
        process.exit(1);
    }

    let sourceData;
    try {
        sourceData = JSON.parse(fs.readFileSync(STORE_FILE, 'utf8'));
    } catch (err) {
        console.error('[Migration] Failed to parse store.json:', err.message);
        mongoose.connection.close();
        process.exit(1);
    }

    const patientsList = sourceData.patients ? Object.values(sourceData.patients) : [];
    const reviewsList = sourceData.reviews || [];

    console.log(`[Migration] Found ${patientsList.length} patients and ${reviewsList.length} reviews to migrate.`);

    // 1. Migrate Patients
    console.log('[Migration] Migrating patients...');
    let migratedPatientsCount = 0;
    for (const rawPatient of patientsList) {
        try {
            // Check if password is already a bcrypt hash (starts with $2a$ or $2b$ and length is 60)
            const password = rawPatient.password || 'password123';
            const isAlreadyHashed = typeof password === 'string' && password.startsWith('$2') && password.length === 60;
            const hashedPassword = isAlreadyHashed ? password : await bcrypt.hash(password, 10);

            // Clean up role if it exists (dropping it as requested)
            const { role, password: _, cnic, ...patientProps } = rawPatient;

            // Clear any existing document with this CNIC to allow clean re-runs
            await Patient.findByIdAndDelete(cnic);

            const mongoPatient = new Patient({
                _id: cnic, // CNIC acts as Primary Key (_id)
                password: hashedPassword,
                ...patientProps
            });

            await mongoPatient.save();
            migratedPatientsCount++;
            console.log(` [+] Migrated patient: ${rawPatient.name} (${cnic})`);
        } catch (patientErr) {
            console.error(` [!] Error migrating patient ${rawPatient.name || 'Unknown'}:`, patientErr.message);
        }
    }

    // 2. Migrate Reviews
    console.log('[Migration] Migrating reviews...');
    let migratedReviewsCount = 0;
    // Clear existing reviews to prevent double insertions during re-runs
    try {
        await Review.deleteMany({});
    } catch (clearErr) {
        console.warn('[Migration] Warning during clearing existing reviews:', clearErr.message);
    }

    for (const rawReview of reviewsList) {
        try {
            const mongoReview = new Review({
                id: rawReview.id,
                doctorName: rawReview.doctorName,
                speciality: rawReview.speciality,
                hospital: rawReview.hospital,
                rating: rawReview.rating,
                remarks: rawReview.remarks,
                patientName: rawReview.patientName,
                date: rawReview.date ? new Date(rawReview.date) : new Date()
            });

            await mongoReview.save();
            migratedReviewsCount++;
        } catch (reviewErr) {
            console.error(` [!] Error migrating review for ${rawReview.doctorName || 'Unknown'}:`, reviewErr.message);
        }
    }

    console.log('\n======================================================');
    console.log('[Migration] MIGRATION REPORT:');
    console.log(` - Successfully migrated Patients: ${migratedPatientsCount}/${patientsList.length}`);
    console.log(` - Successfully migrated Reviews:  ${migratedReviewsCount}/${reviewsList.length}`);
    console.log('======================================================\n');

    console.log('[Migration] Closing database connection...');
    await mongoose.connection.close();
    console.log('[Migration] Done!');
    process.exit(0);
}

runMigration();
