"use client";

import { setAttr } from '../../lib/visual-editor.js';

import Link from 'next/link';


export default function PricingSection({ id, tagline, headline, pricing_cards = [] }) {
  if (!pricing_cards || pricing_cards.length === 0) {
    return null;
  }

  return (
    <section className="pricing-section">
      <div className="container">
        <div className="pricing-header">
          {tagline && <p
            className="tagline"

            data-directus={setAttr({
              collection: 'block_pricing',
              item: id,
              fields: 'tagline',
              mode: 'popover'
            })}
          >
            {tagline}
          </p>}
          {headline && <h2
       
            data-directus={setAttr({
              collection: 'block_pricing',
              item: id,
              fields: 'headline',
              mode: 'popover'
            })}>{headline}</h2>}
        </div>

        <div className="pricing-plans">
          {pricing_cards.map((plan, index) => (
            <div className={`pricing-plan ${plan.is_highlighted ? 'featured' : ''}`} key={index}
        
              data-directus={setAttr({
                collection: 'block_pricing_cards',
                item: plan.id,
                fields: ['title', 'price', 'description', 'badge', 'is_highlighted', 'features', 'button'],
                mode: 'drawer'
              })}>
              {plan.badge && <span className="badge">{plan.badge}</span>}
              <h3>{plan.title}</h3>
              <div className="price">{plan.price}</div>
              {plan.description && <p className="plan-description">{plan.description}</p>}

              {plan.features && (
                <ul className="features">
                  {plan.features.map((feature, idx) => (
                    <li key={idx}>{feature.trim()}</li>
                  ))}
                </ul>
              )}

              {plan.button && plan.button.label && (
                <Link
                  href={resolveButtonUrl(plan.button)}
                  className={`cta-button ${plan.is_highlighted ? 'featured-cta' : ''}`}
                >
                  {plan.button.label}
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>

 
    </section>
  );
}
