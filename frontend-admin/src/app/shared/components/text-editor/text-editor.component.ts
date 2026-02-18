import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { NgClass } from '@angular/common';

const BLOCKED_TAGS = new Set([
  'SCRIPT',
  'IFRAME',
  'OBJECT',
  'EMBED',
  'APPLET',
  'STYLE',
  'LINK',
  'META',
  'BASE',
  'FORM',
]);

const ALLOWED_TAGS = new Set([
  'A',
  'B',
  'STRONG',
  'I',
  'EM',
  'U',
  'BR',
  'P',
  'DIV',
  'UL',
  'OL',
  'LI',
  'SPAN',
]);

@Component({
  selector: 'fuse-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.scss'],
  imports: [NgClass],
})
export class TextEditorComponent implements AfterViewInit {
  @ViewChild('editorRef') editorRef?: ElementRef<HTMLDivElement>;

  @Input() value = '';
  @Input() placeholder = 'Digite aqui...';

  @Output() valueChange = new EventEmitter<string>();

  isFocused = false;

  ngAfterViewInit() {
    this.writeValue(this.value);
  }

  applyCommand(command: 'bold' | 'italic' | 'underline') {
    this.focusEditor();
    document.execCommand(command);
    this.handleInput();
  }

  insertLink() {
    this.focusEditor();
    const url = window.prompt('Informe a URL do link (https://...)');
    if (!url) return;

    const safeUrl = this.sanitizeUrl(url);
    if (!safeUrl) return;

    document.execCommand('createLink', false, safeUrl);
    this.handleInput();
  }

  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const text = event.clipboardData?.getData('text/plain') ?? '';
    document.execCommand('insertText', false, text);
    this.handleInput();
  }

  handleInput() {
    const editor = this.editorRef?.nativeElement;
    if (!editor) return;

    const clean = this.sanitizeHtml(editor.innerHTML);
    if (clean !== editor.innerHTML) {
      editor.innerHTML = clean;
      this.placeCursorAtEnd(editor);
    }

    this.valueChange.emit(clean);
  }

  writeValue(value: string) {
    const editor = this.editorRef?.nativeElement;
    if (!editor) return;
    editor.innerHTML = this.sanitizeHtml(value ?? '');
  }

  focusEditor() {
    this.editorRef?.nativeElement.focus();
  }

  private sanitizeHtml(html: string): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    for (const tag of BLOCKED_TAGS) {
      doc.body.querySelectorAll(tag.toLowerCase()).forEach((node) => node.remove());
    }

    doc.body.querySelectorAll('*').forEach((node) => {
      const el = node as HTMLElement;
      const tagName = el.tagName.toUpperCase();

      if (!ALLOWED_TAGS.has(tagName)) {
        const parent = el.parentNode;
        if (parent) {
          while (el.firstChild) parent.insertBefore(el.firstChild, el);
          parent.removeChild(el);
        }
        return;
      }

      Array.from(el.attributes).forEach((attr) => {
        const name = attr.name.toLowerCase();
        const value = attr.value;

        if (name.startsWith('on')) {
          el.removeAttribute(attr.name);
          return;
        }

        if (tagName === 'A') {
          if (name !== 'href' && name !== 'target' && name !== 'rel') {
            el.removeAttribute(attr.name);
            return;
          }

          if (name === 'href') {
            const safeUrl = this.sanitizeUrl(value);
            if (!safeUrl) {
              el.removeAttribute('href');
            } else {
              el.setAttribute('href', safeUrl);
              el.setAttribute('target', '_blank');
              el.setAttribute('rel', 'noopener noreferrer');
            }
          }
          return;
        }

        el.removeAttribute(attr.name);
      });
    });

    return doc.body.innerHTML;
  }

  private sanitizeUrl(url: string): string | null {
    const trimmed = url.trim();
    if (!trimmed) return null;

    if (
      trimmed.startsWith('http://') ||
      trimmed.startsWith('https://') ||
      trimmed.startsWith('mailto:') ||
      trimmed.startsWith('tel:')
    ) {
      return trimmed;
    }

    if (trimmed.startsWith('www.')) {
      return `https://${trimmed}`;
    }

    return null;
  }

  private placeCursorAtEnd(element: HTMLElement) {
    const selection = window.getSelection();
    if (!selection) return;
    const range = document.createRange();
    range.selectNodeContents(element);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
  }
}
