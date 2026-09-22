CREATE TABLE public.lab_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_name TEXT NOT NULL CHECK (char_length(patient_name) BETWEEN 2 AND 120),
  phone TEXT NOT NULL CHECK (phone ~ '^01[0125][0-9]{8}$'),
  branch TEXT NOT NULL CHECK (branch IN ('فرشوط', 'نجع حمادي')),
  status TEXT NOT NULL DEFAULT 'جديد' CHECK (status IN ('جديد', 'تم التواصل', 'مكتمل', 'ملغي')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.lab_bookings TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.lab_bookings TO authenticated;
GRANT ALL ON public.lab_bookings TO service_role;
ALTER TABLE public.lab_bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can submit lab bookings"
ON public.lab_bookings
FOR INSERT
TO anon, authenticated
WITH CHECK (
  char_length(patient_name) BETWEEN 2 AND 120
  AND phone ~ '^01[0125][0-9]{8}$'
  AND branch IN ('فرشوط', 'نجع حمادي')
  AND status = 'جديد'
);
CREATE INDEX lab_bookings_created_at_idx ON public.lab_bookings (created_at DESC);