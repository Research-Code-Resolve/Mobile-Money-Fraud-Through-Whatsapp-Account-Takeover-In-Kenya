import { addReport, addComment } from './communityService';

/**
 * Demo Data Seeder
 * Adds sample fraud reports for demonstration purposes
 */

export const seedDemoData = async () => {
  console.log('🌱 Seeding demo data...');
  
  try {
    // Sample reports with realistic Kenyan phone numbers
    const demoReports = [
      {
        phoneNumber: '+254712345678',
        fraudType: 'whatsapp_takeover',
        description: 'Someone hacked my mothers WhatsApp and pretended to be her. They asked me to send KES 20,000 urgently for a medical emergency. I almost sent it but called her first!',
        amount: 0, // Didn't lose money
        hasEvidence: true,
        userName: 'John M.',
      },
      {
        phoneNumber: '+254712345678',
        fraudType: 'whatsapp_takeover',
        description: 'This number contacted my brother claiming to be me. They had all my details and asked for money. Very sophisticated scam!',
        amount: 15000,
        hasEvidence: true,
        userName: 'Mary K.',
      },
      {
        phoneNumber: '+254798765432',
        fraudType: 'fake_mpesa',
        description: 'Sent fake M-PESA message after I sent them goods. The transaction ID was invalid. Lost my merchandise.',
        amount: 8500,
        hasEvidence: true,
        userName: 'Peter O.',
      },
      {
        phoneNumber: '+254723456789',
        fraudType: 'sim_swap',
        description: 'They swapped my SIM card and accessed my M-PESA. Stole KES 45,000 before I could block it. Filed police report.',
        amount: 45000,
        hasEvidence: true,
        userName: 'Grace W.',
      },
      {
        phoneNumber: '+254756789012',
        fraudType: 'impersonation',
        description: 'Claimed to be from Safaricom asking me to verify my account. They wanted my ID number and M-PESA PIN. I refused.',
        amount: 0,
        hasEvidence: false,
        userName: 'David N.',
      },
      {
        phoneNumber: '+254756789012',
        fraudType: 'impersonation',
        description: 'Same number called my mother pretending to be from the bank. She almost gave them her details.',
        amount: 0,
        hasEvidence: false,
        userName: 'Sarah L.',
      },
      {
        phoneNumber: '+254734567890',
        fraudType: 'loan_scam',
        description: 'Offered me a loan of KES 500,000 with low interest. Asked for KES 5,000 processing fee. Never heard from them again.',
        amount: 5000,
        hasEvidence: true,
        userName: 'James M.',
      },
      {
        phoneNumber: '+254765432109',
        fraudType: 'job_scam',
        description: 'Promised me a job in Dubai. Asked for KES 25,000 for visa processing. Total scam, no job exists.',
        amount: 25000,
        hasEvidence: true,
        userName: 'Lucy K.',
      },
      {
        phoneNumber: '+254712345678',
        fraudType: 'whatsapp_takeover',
        description: 'This number has been reported multiple times. Be very careful! They are professional scammers.',
        amount: 0,
        hasEvidence: false,
        userName: 'Anonymous',
      },
      {
        phoneNumber: '+254745678901',
        fraudType: 'fake_mpesa',
        description: 'Sent screenshot of fake M-PESA confirmation. The message looked real but when I checked, no money came.',
        amount: 3000,
        hasEvidence: true,
        userName: 'Michael T.',
      },
      {
        phoneNumber: '+254789012345',
        fraudType: 'other',
        description: 'Pretended to be from KRA asking for tax payment via M-PESA. KRA never asks for payment this way!',
        amount: 0,
        hasEvidence: false,
        userName: 'Faith N.',
      },
      {
        phoneNumber: '+254798765432',
        fraudType: 'fake_mpesa',
        description: 'Second report for this number. They are active scammers targeting small business owners.',
        amount: 5000,
        hasEvidence: false,
        userName: 'Robert K.',
      },
    ];

    // Add all reports
    const addedReports = [];
    for (const report of demoReports) {
      const result = await addReport(report);
      if (result.success) {
        addedReports.push(result.report);
        // Add a small delay to ensure different timestamps
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    // Add some comments to the most reported number
    const comments = [
      {
        phoneNumber: '+254712345678',
        text: 'Yes! This number tried the same scam on me last week. Be very careful.',
        userName: 'Alice M.',
      },
      {
        phoneNumber: '+254712345678',
        text: 'They are very convincing. They know personal details somehow. Always verify by calling the actual person!',
        userName: 'Brian K.',
      },
      {
        phoneNumber: '+254798765432',
        text: 'Lost money to this scammer. Filed police report. Everyone please be careful!',
        userName: 'Catherine W.',
      },
    ];

    for (const comment of comments) {
      await addComment(comment.phoneNumber, comment.text, comment.userName);
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log(`✅ Demo data seeded successfully!`);
    console.log(`📊 Added ${addedReports.length} reports`);
    console.log(`💬 Added ${comments.length} comments`);
    
    return {
      success: true,
      reportsCount: addedReports.length,
      commentsCount: comments.length,
    };
  } catch (error) {
    console.error('❌ Error seeding demo data:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Check if demo data already exists
 */
export const hasDemoData = async () => {
  try {
    const { getAllReports } = require('./communityService');
    const reports = await getAllReports();
    return reports.length > 0;
  } catch (error) {
    console.error('Error checking for demo data:', error);
    return false;
  }
};

/**
 * Seed demo data only if database is empty
 */
export const seedDemoDataIfEmpty = async () => {
  const hasData = await hasDemoData();
  
  if (!hasData) {
    console.log('📭 No data found. Seeding demo data...');
    return await seedDemoData();
  } else {
    console.log('✅ Data already exists. Skipping demo seed.');
    return { success: true, skipped: true };
  }
};
