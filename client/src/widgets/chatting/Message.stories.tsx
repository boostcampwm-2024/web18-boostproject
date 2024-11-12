import type { Meta, StoryObj } from '@storybook/react';

import { Message } from './Message';

const meta = {
  component: Message,
} satisfies Meta<typeof Message>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};