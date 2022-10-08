import { useEffect, useState } from 'react';

import './CheatCode.css';
import { isMobile } from './utils';

const KEY_ORDER = [
  { code: 'ArrowUp', character: '↑' },
  { code: 'ArrowUp', character: '↑' },
  { code: 'ArrowDown', character: '↓' },
  { code: 'ArrowDown', character: '↓' },
  { code: 'ArrowLeft', character: '←' },
  { code: 'ArrowRight', character: '→' },
  { code: 'ArrowLeft', character: '←' },
  { code: 'ArrowRight', character: '→' },
  { code: 'KeyB', character: 'B' },
  { code: 'KeyA', character: 'A' },
];

const MY_EMAIL = `vivek@pesto.app`;

/*
 * Shamelessly copied from Rauno:
 * -> https://github.com/raunofreiberg/inspx/blob/79531ad0c9ae75c4409b42000b78e83ac81c072d/www/src/utils.js#L1
 */
function copy(input: string, { target = document.body } = {}) {
  const element = document.createElement('textarea');
  const previouslyFocusedElement = document.activeElement as HTMLElement;

  element.value = input;

  // Prevent keyboard from showing on mobile
  element.setAttribute('readonly', '');

  element.style.contain = 'strict';
  element.style.position = 'absolute';
  element.style.left = '-9999px';
  element.style.fontSize = '12pt'; // Prevent zooming on iOS

  const selection = document.getSelection();
  let originalRange: Range | null = null;
  if (selection && selection.rangeCount > 0) {
    originalRange = selection.getRangeAt(0);
  }

  target.append(element);
  element.select();

  // Explicit selection workaround for iOS
  element.selectionStart = 0;
  element.selectionEnd = input.length;

  let isSuccess = false;
  try {
    isSuccess = document.execCommand('copy');
  } catch {}

  element.remove();

  if (selection && originalRange) {
    selection.removeAllRanges();
    selection.addRange(originalRange);
  }

  // Get the focus back on the previously focused element, if any
  if (previouslyFocusedElement) {
    previouslyFocusedElement.focus();
  }

  return isSuccess;
}

const CheatCode = () => {
  const [keyIndex, setKeyIndex] = useState<number>(0);
  const [showingAnswer, setShowingAnswer] = useState(false);

  useEffect(() => {
    if (import.meta.env.SSR) {
      return undefined;
    }

    const callback = (event: KeyboardEvent) => {
      if (!KEY_ORDER.map((keyInfo) => keyInfo.code).includes(event.code)) {
        return;
      }
      event.preventDefault();

      if (event.code === KEY_ORDER[keyIndex]?.code) {
        const newKeyIndex = keyIndex + 1;
        setKeyIndex(newKeyIndex);

        if (newKeyIndex === KEY_ORDER.length) {
          setShowingAnswer(true);
        }
      } else {
        setKeyIndex(0);
      }
    };

    window.addEventListener('keydown', callback);

    return () => {
      window.removeEventListener('keydown', callback);
    };
  }, [keyIndex]);

  const keyElementArray = KEY_ORDER.map((keyInfo, index) => {
    const className = index === keyIndex ? 'active' : '';
    return (
      <kbd className={className} key={index}>
        {keyInfo.character}
      </kbd>
    );
  });

  if (!import.meta.env.SSR && isMobile()) {
    return null;
  }

  return (
    <div>
      <div className="challenge-row">{keyElementArray}</div>

      {showingAnswer && (
        <div
          className="answer-reveal-row"
          onClick={() => {
            copy(MY_EMAIL);
          }}
        >
          <div className="answer">{MY_EMAIL}</div>

          <div className="copy-button">
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <path
                d="M1 9.50006C1 10.3285 1.67157 11.0001 2.5 11.0001H4L4 10.0001H2.5C2.22386 10.0001 2 9.7762 2 9.50006L2 2.50006C2 2.22392 2.22386 2.00006 2.5 2.00006L9.5 2.00006C9.77614 2.00006 10 2.22392 10 2.50006V4.00002H5.5C4.67158 4.00002 4 4.67159 4 5.50002V12.5C4 13.3284 4.67158 14 5.5 14H12.5C13.3284 14 14 13.3284 14 12.5V5.50002C14 4.67159 13.3284 4.00002 12.5 4.00002H11V2.50006C11 1.67163 10.3284 1.00006 9.5 1.00006H2.5C1.67157 1.00006 1 1.67163 1 2.50006V9.50006ZM5 5.50002C5 5.22388 5.22386 5.00002 5.5 5.00002H12.5C12.7761 5.00002 13 5.22388 13 5.50002V12.5C13 12.7762 12.7761 13 12.5 13H5.5C5.22386 13 5 12.7762 5 12.5V5.50002Z"
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
              ></path>
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheatCode;
