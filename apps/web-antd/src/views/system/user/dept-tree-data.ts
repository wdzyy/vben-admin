export default {
  code: 200,
  msg: '操作成功',
  data: [
    {
      id: 100,
      parentId: 0,
      label: 'XXX科技',
      weight: 0,
      children: [
        {
          id: 101,
          parentId: 100,
          label: '深圳总公司',
          weight: 1,
          children: [
            {
              id: 103,
              parentId: 101,
              label: '研发部门',
              weight: 1,
            },
            {
              id: 104,
              parentId: 101,
              label: '市场部门',
              weight: 2,
            },
            {
              id: 105,
              parentId: 101,
              label: '测试部门',
              weight: 3,
            },
            {
              id: 106,
              parentId: 101,
              label: '财务部门',
              weight: 4,
            },
            {
              id: 107,
              parentId: 101,
              label: '运维部门',
              weight: 5,
            },
          ],
        },
        {
          id: 102,
          parentId: 100,
          label: '长沙分公司',
          weight: 2,
          children: [
            {
              id: 108,
              parentId: 102,
              label: '市场部门',
              weight: 1,
            },
            {
              id: 109,
              parentId: 102,
              label: '财务部门',
              weight: 2,
            },
          ],
        },
      ],
    },
  ],
};
