import { createClient } from '@supabase/supabase-js';

const url = 'https://adzfohfdindovfcpaizb.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkemZvaGZkaW5kb3ZmY3BhaXpiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTY3OTgwMCwiZXhwIjoyMDg3MjU1ODAwfQ.wGaNWPGK8fLF5GMzbiGTApVnktdtaegQkquTMOGPyl8';

const supabase = createClient(url, key);

async function test() {
  const { data, error } = await supabase.from('Bookings').select('*').limit(1);
  if (error) {
    console.error('Error fetching Bookings:', error);
  } else {
    console.log('Columns in Bookings:', data && data.length > 0 ? Object.keys(data[0]) : 'No data');
  }
}

test();
