import { Node, mergeAttributes, nodeInputRule } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { ImageComponent } from './ImageComponent';

export interface ImageOptions {
  inline: boolean;
  allowBase64: boolean;
  HTMLAttributes: Record<string, unknown>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    image: {
      /**
       * Add an image
       */
      setImage: (options: { 
        src: string; 
        alt?: string; 
        title?: string; 
        width?: number; 
        height?: number; 
        align?: string; 
        float?: string;
        mode?: string;
      }) => ReturnType;
    };
  }
}

export const inputRegex = /(?:^|\s)(!\[(.+|:?)]\((\S+)(?:(?:\s+)["'](\S+)["'])?\))$/;

export const Image = Node.create<ImageOptions>({
  name: 'image',

  addOptions() {
    return {
      inline: false,
      allowBase64: false,
      HTMLAttributes: {},
    };
  },

  inline() {
    return this.options.inline;
  },

  group() {
    return this.options.inline ? 'inline' : 'block';
  },

  draggable: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      title: {
        default: null,
      },
      width: {
        default: null,
      },
      height: {
        default: null,
      },
      align: {
        default: 'none',
        parseHTML: element => element.getAttribute('data-align') || 'none',
        renderHTML: attributes => {
          if (!attributes.align) {
            return {};
          }
          return {
            'data-align': attributes.align,
          };
        },
      },
      float: {
        default: 'none',
        parseHTML: element => element.getAttribute('data-float') || 'none',
        renderHTML: attributes => {
          if (!attributes.float) {
            return {};
          }
          return {
            'data-float': attributes.float,
          };
        },
      },
      mode: {
        default: 'wrap',
        parseHTML: element => element.getAttribute('data-mode') || 'wrap',
        renderHTML: attributes => {
          if (!attributes.mode) {
            return {};
          }
          return {
            'data-mode': attributes.mode,
          };
        },
      },
      positionX: {
        default: 0,
        parseHTML: element => parseInt(element.getAttribute('data-position-x') || '0'),
        renderHTML: attributes => {
          if (!attributes.positionX) {
            return {};
          }
          return {
            'data-position-x': attributes.positionX,
          };
        },
      },
      positionY: {
        default: 0,
        parseHTML: element => parseInt(element.getAttribute('data-position-y') || '0'),
        renderHTML: attributes => {
          if (!attributes.positionY) {
            return {};
          }
          return {
            'data-position-y': attributes.positionY,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: this.options.allowBase64
          ? 'img[src]'
          : 'img[src]:not([src^="data:"])',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['img', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageComponent);
  },

  addCommands() {
    return {
      setImage:
        options =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
    };
  },

  addInputRules() {
    return [
      nodeInputRule({
        find: inputRegex,
        type: this.type,
        getAttributes: match => {
          const [, , alt, src, title] = match;

          return { src, alt, title };
        },
      }),
    ];
  },
});