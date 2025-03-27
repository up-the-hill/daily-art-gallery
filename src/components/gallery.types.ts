export default interface Response {
  data: {
    id: number;
    title: string;
    thumbnail: {
      lqip: string;
      width: number;
      height: number;
      alt_text: string;
    }
    date_display: string;
    artist_display: string;
    image_id: string;
  };
  info: {
    license_text: string;
    license_links: any;
    version: string;
  }
  config: {
    iiif_url: string;
    website_url: string;
  }
}
