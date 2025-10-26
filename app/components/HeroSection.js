"use client";

import Image from 'next/image';
import Link from 'next/link';

import { setAttr } from '../../lib/visual-editor.js';


export default function HeroSection({ id, tagline, headline, description, image, layout, button_group = [] }) {

  return (
    <section className="hero-section">
      <div className="container">
        {layout === 'image_left' && image && (
          <div className="hero-image">
            <Image
              src={`https://luminar-edu.nl/assets/${image.id}`}
              alt={image.filename_download || 'Hero Image'}
              width={600}
              height={400}
              priority
              // Add the following attribute
              data-directus={setAttr({ 
                collection: 'block_hero', 
                item: id, 
                fields: 'image',
                mode: 'modal'
              })}
            />
          </div>
        )}

        <div className="hero-content">
          {tagline && (
            <p 
              className="tagline"
             
              data-directus={(setAttr({ 
                collection: 'block_hero', 
                item: id, 
                fields: 'tagline',
                mode: 'popover'
              }))}
            >
              {tagline}
            </p>
          )}
          
          {headline && (
            <h1 

              data-directus={(setAttr({ 
                collection: 'block_hero', 
                item: id, 
                fields: 'headline',
                mode: 'popover'
              }))}
            >
              {headline}
            </h1>
          )}
          
          {description && (
            <p 
              className="description"
 
              data-directus={(setAttr({ 
                collection: 'block_hero', 
                item: id, 
                fields: 'description',
                mode: 'popover'
              }))}
            >
              {description}
            </p>
          )}

          {button_group.length > 0 && (
            <div className="button-group" 
          
              data-directus={(setAttr({ 
                collection: 'block_hero', 
                item: id, 
                fields: 'button_group',
                mode: 'popover'
              }))}>
              {button_group.map((button, idx) => (
                <Link 
                  key={idx} 
                  href={resolveButtonUrl(button)}
                >
                  <button className={`cta-button ${button.variant || 'default'}`}>
                  {button.label}
                  </button>
                </Link>
              ))}
            </div>
          )}
        </div>

        {(layout === 'image_right' || layout === 'image_center' || layout === null) && image && (
          <div className="hero-image">
            <Image
              src={`https://luminar-edu.nl//assets/${image.id}`}
              alt={image.filename_download || 'Hero Image'}
              width={600}
              height={400}
              priority
              // Add the following attribute
              data-directus={setAttr({ 
                  collection: 'block_hero', 
                  item: id, 
                  fields: 'image',
                  mode: 'modal'
                })}
            />
          </div>
        )}
      </div>

      

    </section>
  );
}
