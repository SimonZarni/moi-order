import { useParams } from 'react-router-dom';

import { CONFIG } from 'src/config-global';

import { PlaceEditView } from 'src/sections/places/view';

// ----------------------------------------------------------------------

export default function Page() {
  const { id } = useParams();
  return (
    <>
      <title>{`Edit Place - ${CONFIG.appName}`}</title>
      <PlaceEditView key={id} />
    </>
  );
}
