export type Category = 'Nature' | 'Architecture' | 'Animals' | 'Cityscapes';

export interface Image {
  id: string;
  src: string;
  'data-ai-hint': string;
  title: string;
  category: Category;
}
