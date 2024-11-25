import { defineComponent } from 'vue';

import { Fallback } from '@vben/common-ui';

export default defineComponent({
  name: 'CommonSkeleton',
  setup() {
    return () => (
      <div class="flex h-[600px] w-full items-center justify-center">
        <Fallback
          description="等待开发"
          status="coming-soon"
          title="等待开发"
        />
      </div>
    );
  },
});
