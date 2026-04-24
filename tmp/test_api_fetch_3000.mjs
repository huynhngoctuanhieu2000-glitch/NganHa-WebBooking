const fetch = globalThis.fetch;

async function testFetch() {
  try {
    const res = await fetch('http://localhost:3000/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Fetch',
        phone: '0987654321',
        email: '',
        note: '',
        date: '2026-04-24',
        time: '14:30',
        branchId: 'barbershop',
        branchName: 'Ngan Ha Barbershop',
        guests: 1,
        staffGender: 'any',
        lang: 'vi',
        selectedServices: [
          {
            variantId: 'NHS0001',
            name: 'Test Service',
            duration: 60,
            priceVND: 100000,
            priceUSD: 5,
            quantity: 1,
            customOptions: {}
          }
        ]
      })
    });
    
    console.log('Status:', res.status);
    const text = await res.text();
    console.log('Response text:', text.substring(0, 200));
  } catch (error) {
    console.error('Fetch error:', error);
  }
}

testFetch();
