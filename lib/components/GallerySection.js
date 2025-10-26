"use client";

import { setAttr } from '../visual-editor.js';

import Image from 'next/image';


export default function GallerySection({ id, tagline, headline, items = [] }) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <section className="gallery-section">
      <div className="container">
        {tagline && <p 
          className="tagline" 
          
          data-directus={setAttr({
            collection: 'block_gallery',
            item: id,
            fields: 'tagline',
            mode: 'popover'
          })}>{tagline}</p>}
        {headline && (
          <h2
            className="headline"
           
            data-directus={setAttr({
              collection: 'block_gallery',
              item: id,
              fields: 'headline',
              mode: 'popover'
            })}
          >
            {headline}
          </h2>
        )}
        <div className="gallery-grid"
             
            data-directus={setAttr({
              collection: 'block_gallery',
              item: id,
              fields: 'items',
              mode: 'popover'
            })}>
          {items.map((item, index) => (
            <div className="gallery-item" key={index}>
              {item.directus_file?.id && (
                <Image
                  src={`https://luminar-edu.nl/assets/${item.directus_file.id}`}
                  alt={item.directus_file.filename_download || 'Gallery image'}
                  width={400}
                  height={300}
                  className="gallery-image"
                  
                />
              )}
            </div>
          ))}
        </div>
      </div>


    </section>
  );
}

