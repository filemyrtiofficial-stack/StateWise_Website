/**
 * Create Sample Data Script
 * Creates sample services and states for testing
 */

require('dotenv').config();
const { query } = require('../config/database');

async function createSampleData() {
  try {
    console.log('📝 Creating sample data...\n');

    // Check existing data
    const existingServices = await query('SELECT COUNT(*) as count FROM services');
    const existingStates = await query('SELECT COUNT(*) as count FROM states');

    console.log(`Current services: ${existingServices[0].count}`);
    console.log(`Current states: ${existingStates[0].count}\n`);

    // Create sample services if none exist
    if (existingServices[0].count === 0) {
      console.log('Creating sample services...');

      const services = [
        {
          name: 'Seamless Online Filing',
          slug: 'seamless-online-filing',
          description: 'File RTI applications online easily with expert drafting, submission, and timely dispatch.',
          full_description: 'Filing RTI applications online has never been easier. Our seamless online filing service handles everything for you - from expert drafting to submission and timely dispatch.',
          price: 699.00,
          original_price: 4999.00,
          button_text: 'File Now',
          icon: '⚡',
          icon_text: 'Seamless Online Filing'
        },
        {
          name: 'Anonymous RTI Filing',
          slug: 'anonymous',
          description: 'Protect your identity with our discreet service for filing RTI applications on your behalf.',
          full_description: 'Privacy matters when filing RTI applications. Our anonymous RTI filing service protects your identity while ensuring your application is filed correctly.',
          price: 699.00,
          original_price: 5999.00,
          button_text: 'Start Anonymously',
          icon: '🎭',
          icon_text: 'ANONYMOUS RTI Filing'
        },
        {
          name: 'Online First Appeal Filing',
          slug: '1st-appeal',
          description: 'File your First Appeal online with expert drafting, review, and quick submission.',
          full_description: 'If your RTI application was rejected or you didn\'t receive a satisfactory response, filing a First Appeal is your next step.',
          price: 699.00,
          original_price: 3999.00,
          button_text: 'Appeal Now',
          icon: '📋',
          icon_text: 'First Appeal'
        },
        {
          name: 'Efficient Bulk RTI Filing',
          slug: 'bulk',
          description: 'Manage and submit multiple RTI applications efficiently with our professional bulk service.',
          full_description: 'Need to file multiple RTI applications? Our efficient bulk RTI filing service makes it easy.',
          price: 0.00,
          original_price: 14999.00,
          button_text: 'Request Quote',
          icon: '📦',
          icon_text: 'Efficient Bulk RTI Filing'
        },
        {
          name: 'Custom RTI',
          slug: 'custom-rti',
          description: 'Can\'t find the right RTI? Create a personalized application designed for your exact information need.',
          full_description: 'Every information need is unique. Our custom RTI service creates a personalized application designed specifically for your exact requirements.',
          price: 1999.00,
          original_price: 3499.00,
          button_text: 'Custom RTI',
          icon: '✏️',
          icon_text: 'Custom RTI'
        },
        {
          name: '15 min RTI',
          slug: '15-minute-consultation',
          description: 'Get personalized advice from legal experts to navigate complex RTI applications effectively.',
          full_description: 'RTI applications can be complex, but expert guidance makes all the difference. With our 15-minute consultation service, you\'ll get personalized advice from legal experts.',
          price: 199.00,
          original_price: 499.00,
          button_text: 'Pay Now',
          icon: '⏱️',
          icon_text: '15-MIN TALK TO EXPERT'
        }
      ];

      for (const service of services) {
        await query(`
          INSERT INTO services (name, slug, description, full_description, price, original_price, button_text, icon, icon_text, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
        `, [
          service.name, service.slug, service.description, service.full_description,
          service.price, service.original_price, service.button_text, service.icon, service.icon_text
        ]);
        console.log(`   ✅ Created service: ${service.name}`);
      }
    } else {
      console.log('✅ Services already exist, skipping...');
    }

    // Create sample states if none exist
    if (existingStates[0].count === 0) {
      console.log('\nCreating sample states...');

      const states = [
        {
          name: 'Telangana',
          slug: 'telangana',
          description: 'RTI filing services for Telangana state',
          rti_portal_url: 'https://rti.telangana.gov.in'
        },
        {
          name: 'Andhra Pradesh',
          slug: 'andhra-pradesh',
          description: 'RTI filing services for Andhra Pradesh state',
          rti_portal_url: 'https://rti.ap.gov.in'
        },
        {
          name: 'Maharashtra',
          slug: 'maharashtra',
          description: 'RTI filing services for Maharashtra state',
          rti_portal_url: 'https://rti.maharashtra.gov.in'
        }
      ];

      for (const state of states) {
        await query(`
          INSERT INTO states (name, slug, description, rti_portal_url, created_at)
          VALUES (?, ?, ?, ?, NOW())
        `, [state.name, state.slug, state.description, state.rti_portal_url]);
        console.log(`   ✅ Created state: ${state.name}`);
      }
    } else {
      console.log('✅ States already exist, skipping...');
    }

    // Show summary
    const finalServices = await query('SELECT COUNT(*) as count FROM services');
    const finalStates = await query('SELECT COUNT(*) as count FROM states');

    console.log('\n📊 Summary:');
    console.log(`   Services: ${finalServices[0].count}`);
    console.log(`   States: ${finalStates[0].count}`);

    // Show service IDs for reference
    const services = await query('SELECT id, name, slug FROM services ORDER BY id');
    console.log('\n📋 Service IDs (for form submission):');
    services.forEach(s => {
      console.log(`   ID ${s.id}: ${s.name} (slug: ${s.slug})`);
    });

    // Show state IDs for reference
    const states = await query('SELECT id, name, slug FROM states ORDER BY id');
    console.log('\n📋 State IDs (for form submission):');
    states.forEach(s => {
      console.log(`   ID ${s.id}: ${s.name} (slug: ${s.slug})`);
    });

    console.log('\n✅ Sample data created successfully!');
    console.log('💡 You can now submit forms with valid service_id and state_id');

  } catch (error) {
    console.error('❌ Error creating sample data:', error.message);
    if (error.code === 'ER_DUP_ENTRY') {
      console.log('💡 Some data already exists, that\'s okay!');
    } else {
      throw error;
    }
  }
}

createSampleData().then(() => {
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});

