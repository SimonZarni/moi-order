import React from 'react';
import { Linking, Text, TextStyle } from 'react-native';

// Splits on URLs so each can be rendered as a tappable link.
const URL_PATTERN = /(https?:\/\/[^\s<>'"]+)/;

interface Props {
  text: string;
  style?: TextStyle | TextStyle[];
  linkStyle?: TextStyle | TextStyle[];
}

export function LinkedText({ text, style, linkStyle }: Props): React.JSX.Element {
  const parts = text.split(URL_PATTERN);

  return (
    <Text style={style}>
      {parts.map((part, i) => {
        if (i % 2 === 1) {
          return (
            <Text
              key={i}
              style={linkStyle}
              onPress={() => { void Linking.openURL(part); }}
              accessibilityRole="link"
              accessibilityLabel={part}
            >
              {part}
            </Text>
          );
        }
        return part === '' ? null : part;
      })}
    </Text>
  );
}
