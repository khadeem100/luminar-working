"use client";

import Image from 'next/image';
import Link from 'next/link';
// Add this import
import { setAttr } from '../../lib/visual-editor.js';

// Add `id` in the list of destructured props
export default function HeroSection({ id, tagline, headline, description, image, layout, button_group = [] }) {

  return (
    <section className="hero-section">
      <div className="container">
        {layout === 'image_left' && image && (
          <div className="hero-image">
            <Image
              src={`http://localhost:8055/assets/${image.id}`}
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
              // Add the following attribute
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
              // Add the following attribute
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
              // Add the following attribute
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
              // Add the following attribute
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
      </div>

      {/* Leave the remaining same as before */}

    </section>
  );
}
