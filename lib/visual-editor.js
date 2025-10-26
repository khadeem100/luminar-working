// lib/visual-editor.js
import { apply, setAttr, remove } from '@directus/visual-editing';

let isApplied = false;

export async function initializeVisualEditor() {
  if (typeof window !== 'undefined' && !isApplied) {
    try {
      await apply({ 
        directusUrl: 'https://luminar-edu.nl/',
        onSaved: async (data) => {
          console.log('Content saved successfully:', data);

          try {
            window.location.reload();
            console.log('Page data refreshed successfully');
          } catch (error) {
            console.error('Failed to refresh page data:', error);
            window.location.reload();
          }
        }
      });
      isApplied = true;
    } catch (error) {
      console.error('Failed to initialize visual editor:', error);
    }
  }
}

export function cleanupVisualEditor() {
  if (typeof window !== 'undefined' && isApplied) {
    remove();
    isApplied = false;
  }
}

export { setAttr };
