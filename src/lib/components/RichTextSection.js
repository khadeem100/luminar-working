"use client";
// Add the following import
import { setAttr } from '../../lib/visual-editor.js';

// Add `id` in the list of destructured props
export default function RichTextSection({ id, tagline, headline, content, alignment = 'center' }) {
  return (
    <section className="rich-text-section">
      <div className="container" style={{ textAlign: alignment }}>
        {tagline && (
          <p 
            className="tagline"
            // Add the following attribute
            data-directus={(setAttr({ 
              collection: 'block_richtext', 
              item: id, 
              fields: 'tagline',
              mode: 'popover'
            }))}
          >
            {tagline}
          </p>
        )}
        {headline && (
          <h2 
            // Add the following attribute
            data-directus={(setAttr({ 
              collection: 'block_richtext', 
              item: id, 
              fields: 'headline',
              mode: 'popover'
            }))}
          >
            {headline}
          </h2>
        )}
        {content && (
          <div 
            className="content" 
            dangerouslySetInnerHTML={{ __html: content }}
              // Add the following attribute
            data-directus={(setAttr({ 
              collection: 'block_richtext', 
              item: id, 
              fields: 'content',
              mode: 'modal'
            }))}
          />
        )}
      </div>

      // Leave the remaining same as before

    </section>
  );
}
