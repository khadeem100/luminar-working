"use client"

import client from '../lib/directus';
import { initializeVisualEditor } from "../lib/visual-editor";
import { readItems } from '@directus/sdk';
import HeroSection from '../lib/components/HeroSection';
import RichTextSection from '../lib/components/RichTextSection';
import GallerySection from '../lib/components/GallerySection';
import PricingSection from '../lib/components/PricingSection';
import FormSection from '../lib/components/FormSection';
import Header from '../lib/components/Header';
import Footer from '../lib/components/Footer';
import { useEffect, useState } from 'react';

export default function Home() {

  const [homePageData, setHomePageData] = useState(null);
  const [navigationData, setNavigationData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const result = await client.request(
        readItems('pages', {
          filter: {
            permalink: {
              _eq: '/'
            }
          },
          fields: [
            "*",
            "blocks.*",
            "blocks.item.*.*.*.*",
          ]
        })
      );
      setHomePageData(result);

      const navData = await client.request(
        readItems('navigation', {
          fields: [
            "*.*.*.*",
          ]
        })
      );
      setNavigationData(navData);

      initializeVisualEditor();
    }
    fetchData();
  }, []);

  if (!homePageData || !navigationData) {
    return <div>Loading...</div>;
  }

  const hero_data = homePageData[0].blocks?.filter(block => block.collection === 'block_hero')?.[0];
  const rich_text_data = homePageData[0].blocks?.filter(block => block.collection === 'block_richtext')?.[0];
  const gallery_data = homePageData[0].blocks?.filter(block => block.collection === 'block_gallery')?.[0];
  const pricing_data = homePageData[0].blocks?.filter(block => block.collection === 'block_pricing')?.[0];
  const form_data = homePageData[0].blocks?.filter(block => block.collection === 'block_form')?.[0];

  return (
    <main>
      <Header
        navigation={navigationData}
      />

      <>
        {hero_data && <HeroSection
          id={hero_data.item.id}
          tagline={hero_data.item.tagline}
          headline={hero_data.item.headline}
          description={hero_data.item.description}
          image={hero_data.item.image}
          layout={hero_data.item.layout}
          button_group={hero_data.item.button_group.buttons}
        />}

        {rich_text_data && <RichTextSection
          {...(rich_text_data.item)}
        />}

        {gallery_data && <GallerySection
          {...(gallery_data.item)}
        />}

        {pricing_data && <PricingSection
          {...(pricing_data.item)} />}

        {form_data && <FormSection
          {...(form_data.item)}
        />}

      </>

      <Footer
        navigation={navigationData}
      />

    </main>
  );
}