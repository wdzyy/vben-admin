import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import PivotTable from '../pivot-table/pivot.vue';

vi.mock('@visactor/vtable', () => ({
  PivotTable: vi.fn().mockImplementation(() => ({
    setRecords: vi.fn(),
    updateOption: vi.fn(),
  })),
}));

describe('pivotTable.vue', () => {
  let wrapper: any;

  const createComponent = (propsData = {}) => {
    wrapper = mount(PivotTable, {
      props: {
        options: {
          columns: [],
          indicators: [],
          rows: [],
        },
        ...propsData,
      },
    });
  };

  beforeEach(() => {
    createComponent();
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('renders correctly', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('initializes options and state correctly', () => {
    expect(wrapper.vm.option).toBeDefined();
    expect(wrapper.vm.state).toBeDefined();
  });

  it('updates table instance on row change', async () => {
    const newRowList = ['row1', 'row2'];
    await wrapper.vm.changeRow(newRowList);
    expect(wrapper.vm.state.rowCheckedList).toEqual(newRowList);
    expect(wrapper.vm.tableInstance.updateOption).toHaveBeenCalled();
  });

  it('updates table instance on column change', async () => {
    const newColumnList = ['col1', 'col2'];
    await wrapper.vm.changeColumn(newColumnList);
    expect(wrapper.vm.state.columnCheckedList).toEqual(newColumnList);
    expect(wrapper.vm.tableInstance.updateOption).toHaveBeenCalled();
  });

  it('updates table instance on indicator change', async () => {
    const newIndicatorList = ['ind1', 'ind2'];
    await wrapper.vm.changeIndicators(newIndicatorList);
    expect(wrapper.vm.state.indicatorsCheckedList).toEqual(newIndicatorList);
    expect(wrapper.vm.tableInstance.updateOption).toHaveBeenCalled();
  });

  it('updates table instance on show totals change', async () => {
    wrapper.vm.showColGrandTotals = true;
    wrapper.vm.showColSubTotals = true;
    wrapper.vm.showRowGrandTotals = true;
    wrapper.vm.showRowSubTotals = true;
    await wrapper.vm.changeShowTotals();
    expect(wrapper.vm.tableInstance.updateOption).toHaveBeenCalled();
  });

  it('sets data correctly', () => {
    const records = [{ id: 1, name: 'test' }];
    wrapper.vm.setData(records);
    expect(wrapper.vm.tableInstance.setRecords).toHaveBeenCalledWith(records);
  });

  it('updates height on window resize', () => {
    const updateHeightSpy = vi.spyOn(wrapper.vm, 'updateHeight');
    window.dispatchEvent(new Event('resize'));
    expect(updateHeightSpy).toHaveBeenCalled();
  });

  it('cleans up on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
    wrapper.unmount();
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'resize',
      wrapper.vm.updateHeight,
    );
  });
});
