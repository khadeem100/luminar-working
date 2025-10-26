"use client";

import { setAttr } from '../../lib/visual-editor.js';


export default function RichTextSection({ id, tagline, headline, content, alignment = 'center' }) {
  return (
    <section className="rich-text-section">
      <div className="container" style={{ textAlign: alignment }}>
        {tagline && (
          <p 
            className="tagline"
            
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
              
            data-directus={(setAttr({ 
              collection: 'block_richtext', 
              item: id, 
              fields: 'content',
              mode: 'modal'
            }))}
          />
        )}
      </div>


    </section>
  );
}
