'use client';

import 'react-datepicker/dist/react-datepicker.css';
import DatePicker, { registerLocale } from 'react-datepicker';
import { enGB } from 'date-fns/locale';

// Δηλώνουμε μόνο το en-GB μία φορά
registerLocale('en-GB', enGB);

// Παίρνει ό,τι props παίρνει και το react-datepicker
type Props = React.ComponentProps<typeof DatePicker>;

/**
 * Πάντα Αγγλικά (en-GB). Setάρουμε και format/placeholder.
 */
export default function VirygoDatePicker(props: Props) {
  return (
    <DatePicker
      locale="en-GB"
      dateFormat="MM/dd/yyyy"
      placeholderText="mm/dd/yyyy"
      withPortal
      popperClassName="z-30"
      {...props}
    />
  );
}
