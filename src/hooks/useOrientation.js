import { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';

export const useOrientation = () => {
  const dimensions = Dimensions.get('screen');
  const [orientation, setOrientation] = useState(dimensions.height >= dimensions.width ? "PORTRAIT" : "LANDSCAPE");

  useEffect(() => {
    const listener = Dimensions.addEventListener('change', ({ window: { width, height } }) => {
      if (width < height)
        setOrientation("PORTRAIT");
      else
        setOrientation("LANDSCAPE");
    });
    return () => listener.remove();
  }, []);

  return orientation;
};