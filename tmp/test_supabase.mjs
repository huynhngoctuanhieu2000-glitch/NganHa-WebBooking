import { createClient } from '@supabase/supabase-js';

const url = 'https://adzfohfdindovfcpaizb.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkemZvaGZkaW5kb3ZmY3BhaXpiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTY3OTgwMCwiZXhwIjoyMDg3MjU1ODAwfQ.wGaNWPGK8fLF5GMzbiGTApVnktdtaegQkquTMOGPyl8';

const supabase = createClient(url, key);

async function test() {
  const { error } = await supabase.from('Bookings').insert({
    id: 'TEST-1234',
    billCode: 'TEST-1234',
    branchName: 'Ngan Ha Spa',
    bookingDate: new Date().toISOString(),
    customerName: 'Test',
    customerLang: 'vi',
    status: 'NEW',
    totalAmount: 0,
    tip: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  if (error) {
    console.error('Insert Bookings error:', error);
    return;
  }

  const { error: itemsError } = await supabase.from('BookingItems').insert({
      id: 'TEST-1234-SVC1',
      bookingId: 'TEST-1234',
      serviceId: 'NHS0001',
      quantity: 1,
      price: 0,
      status: 'WAITING',
  });

  if (itemsError) {
    console.error('Insert BookingItems error:', itemsError);
  } else {
    console.log('Insert success! Deleting now...');
  }
  
  await supabase.from('BookingItems').delete().eq('bookingId', 'TEST-1234');
  await supabase.from('Bookings').delete().eq('id', 'TEST-1234');
}

test();
