import { ActionIcon, useMantineColorScheme, useComputedColorScheme } from '@mantine/core';
import { IconSun, IconMoon } from '@tabler/icons-react';

export function ThemeToggle() {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

  return (
    <ActionIcon
      onClick={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')}
      variant="default"
      size="lg"
      radius="xl"
      aria-label="Toggle color scheme"
      style={{ marginLeft: '10px' }}
    >
      {computedColorScheme === 'dark' ? (
        <IconSun stroke={1.5} size="1.2rem" />
      ) : (
        <IconMoon stroke={1.5} size="1.2rem" />
      )}
    </ActionIcon>
  );
}
