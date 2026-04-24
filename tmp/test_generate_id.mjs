import { createClient } from '@supabase/supabase-js';

const url = 'https://adzfohfdindovfcpaizb.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkemZvaGZkaW5kb3ZmY3BhaXpiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTY3OTgwMCwiZXhwIjoyMDg3MjU1ODAwfQ.wGaNWPGK8fLF5GMzbiGTApVnktdtaegQkquTMOGPyl8';

const supabase = createClient(url, key);

const BOOKING_ID_PREFIX = 'WB';

async function test() {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, '0');
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const yyyy = String(now.getFullYear());
  const dateStr = `${dd}${mm}${yyyy}`;

  const { count, error } = await supabase
    .from('Bookings')
    .select('id', { count: 'exact', head: true })
    .like('id', `${BOOKING_ID_PREFIX}-%-${dateStr}`);

  if (error) {
    console.error('Error generating ID:', error);
  } else {
    console.log('Count:', count);
  }
}

test();
