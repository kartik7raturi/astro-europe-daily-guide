-- Explicit admin-only write policies on astro_calendar
DROP POLICY IF EXISTS "Admins can insert astro calendar" ON public.astro_calendar;
DROP POLICY IF EXISTS "Admins can update astro calendar" ON public.astro_calendar;
DROP POLICY IF EXISTS "Admins can delete astro calendar" ON public.astro_calendar;

CREATE POLICY "Admins can insert astro calendar"
ON public.astro_calendar
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update astro calendar"
ON public.astro_calendar
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete astro calendar"
ON public.astro_calendar
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));