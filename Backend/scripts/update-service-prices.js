/**
 * Update Service Prices Script
 * Updates prices for all services in the database
 */

require('dotenv').config();
const { query } = require('../config/database');

async function updateServicePrices() {
  try {
    console.log('💰 Updating service prices...\n');

    const priceUpdates = [
      { slug: 'seamless-online-filing', price: 399.00, name: 'Seamless Online Filing' },
      { slug: '15-minute-consultation', price: 199.00, name: '15 min RTI' },
      { slug: 'anonymous', price: 699.00, name: 'Anonymous RTI Filing' },
      { slug: '1st-appeal', price: 399.00, name: 'Online First Appeal Filing' },
      { slug: 'bulk', price: 0.00, name: 'Efficient Bulk RTI Filing' }
    ];

    for (const update of priceUpdates) {
      const result = await query(
        'UPDATE services SET price = ?, updated_at = NOW() WHERE slug = ?',
        [update.price, update.slug]
      );

      if (result.affectedRows > 0) {
        console.log(`   ✅ Updated ${update.name}: ₹${update.price}`);
      } else {
        console.log(`   ⚠️  Service not found: ${update.name} (slug: ${update.slug})`);
      }
    }

    // Verify updates
    console.log('\n📊 Verifying updated prices:');
    const services = await query('SELECT slug, name, price FROM services ORDER BY id');
    services.forEach(service => {
      console.log(`   ${service.name} (${service.slug}): ₹${parseFloat(service.price).toFixed(2)}`);
    });

    console.log('\n✅ Price update completed!');
  } catch (error) {
    console.error('❌ Error updating prices:', error.message);
    throw error;
  }
}

updateServicePrices()
  .then(() => {
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

