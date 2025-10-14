// src/utils/visualEditing.js
import { apply, setAttr } from '@directus/visual-editing';

const DIRECTUS_URL = 'https://luminar-edu.nl';

export const initVisualEditing = async () => {
  const searchParams = new URLSearchParams(window.location.search);
  const isVisualEditing = searchParams.get('visual-editing') === 'true';

  if (!isVisualEditing) return null;

  try {
    const { disable, enable, remove } = await apply({
      directusUrl: DIRECTUS_URL,
      onSaved: ({ collection, item, payload }) => {
        console.log('Saved:', collection, item, payload);
        window.location.reload(); // optional reload
      },
    });

    return { disable, enable, remove, setAttr, isVisualEditing };
  } catch (err) {
    console.error('Failed to initialize Directus Visual Editing:', err);
    return null;
  }
};
