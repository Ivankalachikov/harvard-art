'use client';

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { ArtObjectDetails } from '@/types/object';
import { getObjectDetails } from '@/api';
import { Captions, Counter, Zoom } from 'yet-another-react-lightbox/plugins';
import { RenderSlideProps, Slide } from 'yet-another-react-lightbox';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.scss';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/captions.css';
import 'yet-another-react-lightbox/plugins/counter.css';
import LightboxSlide from '@/components/LightboxSlide';
import useLightbox from '@/hooks/useLightbox';

export default function Details({ params }: { params: { slug: string } }) {
  const { openLightbox, renderLightbox } = useLightbox();
  const [lightboxImageIndex, setLightboxImageIndex] = useState(0);

  const { data }: UseQueryResult<ArtObjectDetails> = useQuery(
    ['objects', params.slug],
    async () => {
      return getObjectDetails(params.slug, {
        apikey: process.env.NEXT_PUBLIC_API_KEY,
      });
    },
    {
      refetchOnWindowFocus: false,
    },
  );

  const handleImageClick = (index: number) => {
    openLightbox();
    setLightboxImageIndex(index);
  };

  return (
    <div className='object-details'>
      <h1>{data?.title}</h1>
      <p>{data?.description}</p>
      <Link href='/'>Back</Link>
      {renderLightbox({
        plugins: [Captions, Counter, Zoom],
        captions: { showToggle: true },
        counter: { container: { style: { top: '30px' } } },
        slides: data?.images.map((image) => ({
          src: image.baseimageurl,
          width: image.width,
          height: image.height,
          alt: image.publiccaption,
          title: image.publiccaption,
        })),
        render: { slide: LightboxSlide },
        index: lightboxImageIndex,
        zoom: {
          scrollToZoom: true,
        },
      })}
      {data?.images.map((image, index) => (
        <div className={styles.image} key={image.imageid}>
          <Image
            fill
            src={image.baseimageurl}
            sizes='(300px)'
            alt={image.publiccaption}
            onClick={() => handleImageClick(index)}
          ></Image>
        </div>
      ))}
    </div>
  );
}
