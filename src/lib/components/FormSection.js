'use client';
import { setAttr } from '../../lib/visual-editor.js';

import { useState } from 'react';

export default function FormSection({ id, tagline, headline, form }) {
  const [formData, setFormData] = useState(
    () => form.fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {})
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8055/items/form_submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Submission failed');
      }

      setIsSubmitted(true);
      setFormData(form.fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {}));
    } catch (err) {
      console.error(err);
      setError('There was an error submitting your form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!form || !form.fields) return null;

  return (
    <section className="form-section">
      <div className="container">
        <div className="form-header">
          {tagline && <p 
            data-directus={setAttr({
              collection: 'block_form',
              item: id,
              fields: 'tagline',
              mode: 'popover'
            })} className="tagline">{tagline}</p>}
          {headline && <h2 
            // Add the following attribute
            data-directus={setAttr({
              collection: 'block_form',
              item: id,
              fields: 'headline',
              mode: 'popover'
            })}>{headline}</h2>}
        </div>

        {isSubmitted ? (
          <div className="success-message">
            <h3>Thank you!</h3>
            <p>{form.success_message || 'Your form has been successfully submitted.'}</p>
            <button onClick={() => setIsSubmitted(false)} className="reset-button">
              Submit another response
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="contact-form"
            // Add the following attribute 
            data-directus={setAttr({
              collection: 'block_form',
              item: id,
              fields: 'form',
              mode: 'popover'
            })}>
            {error && <div className="error-message">{error}</div>}

            {form.fields.map((field) => (
              <div className="form-group" key={field.id}>
                <label htmlFor={field.name}>{field.label}</label>
                {field.type === 'textarea' ? (
                  <textarea
                    id={field.name}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    rows="5"
                    required={field.required}
                  />
                ) : (
                  <input
                    id={field.name}
                    type={field.type || 'text'}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    required={field.required}
                  />
                )}
              </div>
            ))}

            <button 
              type="submit" 
              className="submit-button" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : (form.submit_label || 'Submit')}
            </button>
          </form>
        )}
      </div>

    </section>
  );
}
