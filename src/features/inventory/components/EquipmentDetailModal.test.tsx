import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import type { ItemDef } from '@shared/types';
import { EquipmentDetailModal } from './EquipmentDetailModal';

jest.mock('react-native/Libraries/Modal/Modal', () => {
  function MockModal({
    visible,
    children,
  }: {
    visible: boolean;
    children: React.ReactNode;
  }) {
    return visible ? children : null;
  }
  MockModal.displayName = 'Modal';
  return { __esModule: true, default: MockModal };
});

const ironAxe: ItemDef = {
  id: 'iron_axe',
  name: 'Iron Axe',
  slot: 'weapon',
  rarity: 'common',
  weaponType: 'axe',
  attack: 18,
  defense: 0,
  health: 0,
  speed: 0,
  description: 'A sturdy felling axe, equally at home in timber and in a shield wall.',
};

const mjolnir: ItemDef = {
  id: 'mjolnir_shard',
  name: "Thor's Hammer fragment",
  slot: 'amulet',
  rarity: 'epic',
  attack: 12,
  defense: 6,
  health: 10,
  speed: 0,
  description: 'A splinter of thunder-iron. It answers only to the Viking who found it.',
  bound: true,
};

describe('EquipmentDetailModal', () => {
  it('renders icon, name, type, rarity, description, stats, and tradable status', async () => {
    const { getByText, getByLabelText, getByTestId } = await render(
      <EquipmentDetailModal item={ironAxe} onClose={jest.fn()} />,
    );

    expect(getByTestId('equipment-detail-modal')).toBeTruthy();
    expect(getByLabelText('Iron Axe image')).toBeTruthy();
    expect(getByText('Iron Axe')).toBeTruthy();
    expect(getByText('Weapon · Axe · Common')).toBeTruthy();
    expect(getByText(ironAxe.description ?? '')).toBeTruthy();
    expect(getByText('ATK 18 · DEF 0 · HP 0 · SPD 0')).toBeTruthy();
    expect(getByText('Tradable')).toBeTruthy();
    expect(getByTestId('equipment-detail-frame-common')).toBeTruthy();
  });

  it('shows Bound for soulbound relics', async () => {
    const { getByText, getByTestId } = await render(
      <EquipmentDetailModal item={mjolnir} onClose={jest.fn()} />,
    );

    expect(getByText("Thor's Hammer fragment")).toBeTruthy();
    expect(getByText('Amulet · Epic')).toBeTruthy();
    expect(getByText('Bound')).toBeTruthy();
  });

  it('renders nothing when no item is selected', async () => {
    const { queryByTestId } = await render(<EquipmentDetailModal item={null} onClose={jest.fn()} />);
    expect(queryByTestId('equipment-detail-modal')).toBeNull();
  });

  it('dismisses from the close control and scrim', async () => {
    const onClose = jest.fn();
    const { getByLabelText } = await render(
      <EquipmentDetailModal item={ironAxe} onClose={onClose} />,
    );

    fireEvent.press(getByLabelText('Close'));
    fireEvent.press(getByLabelText('Dismiss equipment'));
    expect(onClose).toHaveBeenCalledTimes(2);
  });
});
