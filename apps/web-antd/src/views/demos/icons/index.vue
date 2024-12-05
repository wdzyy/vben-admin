<script lang="ts" setup>
import { ref } from 'vue';

import { IconPicker, Page } from '@vben/common-ui';
import {
  IconifyIcon,
  MdiGithub,
  MdiGoogle,
  MdiKeyboardEsc,
  MdiQqchat,
  MdiWechat,
  SvgAvatar1Icon,
  SvgAvatar2Icon,
  SvgAvatar3Icon,
  SvgAvatar4Icon,
  SvgBellIcon,
  SvgCakeIcon,
  SvgCardIcon,
  SvgDownloadIcon,
} from '@vben/icons';

import { Card, Input } from 'ant-design-vue';

const iconData = [
  'ant-design:account-book-filled',
  'ant-design:account-book-outlined',
  'ant-design:account-book-twotone',
  'ant-design:aim-outlined',
  'ant-design:alert-filled',
  'ant-design:alert-outlined',
  'ant-design:alert-twotone',
  'ant-design:alibaba-outlined',
  'ant-design:align-center-outlined',
  'ant-design:align-left-outlined',
  'ant-design:align-right-outlined',
  'ant-design:alipay-circle-filled',
  'ant-design:alipay-circle-outlined',
  'ant-design:alipay-outlined',
  'ant-design:alipay-square-filled',
  'ant-design:aliwangwang-filled',
  'ant-design:aliwangwang-outlined',
  'ant-design:aliyun-outlined',
  'ant-design:amazon-circle-filled',
  'ant-design:amazon-outlined',
  'ant-design:amazon-square-filled',
  'ant-design:android-filled',
  'ant-design:android-outlined',
  'ant-design:ant-cloud-outlined',
  'ant-design:ant-design-outlined',
  'ant-design:apartment-outlined',
  'ant-design:api-filled',
  'ant-design:api-outlined',
  'ant-design:api-twotone',
  'ant-design:apple-filled',
  'ant-design:apple-outlined',
  'ant-design:appstore-add-outlined',
  'ant-design:appstore-filled',
  'ant-design:appstore-outlined',
  'ant-design:appstore-twotone',
  'ant-design:area-chart-outlined',
  'ant-design:arrow-down-outlined',
  'ant-design:arrow-left-outlined',
  'ant-design:arrow-right-outlined',
  'ant-design:arrow-up-outlined',
  'ant-design:arrows-alt-outlined',
  'ant-design:audio-filled',
  'ant-design:audio-muted-outlined',
  'ant-design:audio-outlined',
  'ant-design:audio-twotone',
  'ant-design:audit-outlined',
  'ant-design:backward-filled',
  'ant-design:backward-outlined',
  'ant-design:bank-filled',
  'ant-design:bank-outlined',
  'ant-design:bank-twotone',
  'ant-design:bar-chart-outlined',
  'ant-design:barcode-outlined',
  'ant-design:bars-outlined',
  'ant-design:behance-circle-filled',
  'ant-design:behance-outlined',
  'ant-design:behance-square-filled',
  'ant-design:behance-square-outlined',
  'ant-design:bell-filled',
  'ant-design:bell-outlined',
  'ant-design:bell-twotone',
  'ant-design:bg-colors-outlined',
  'ant-design:block-outlined',
  'ant-design:bold-outlined',
  'ant-design:book-filled',
  'ant-design:book-outlined',
  'ant-design:book-twotone',
  'ant-design:border-bottom-outlined',
  'ant-design:border-horizontal-outlined',
  'ant-design:border-inner-outlined',
  'ant-design:border-left-outlined',
  'ant-design:border-outer-outlined',
  'ant-design:border-outlined',
  'ant-design:border-right-outlined',
  'ant-design:border-top-outlined',
  'ant-design:border-verticle-outlined',
  'ant-design:borderless-table-outlined',
  'ant-design:box-plot-filled',
  'ant-design:box-plot-outlined',
  'ant-design:box-plot-twotone',
  'ant-design:branches-outlined',
  'ant-design:bug-filled',
  'ant-design:bug-outlined',
  'ant-design:bug-twotone',
  'ant-design:build-filled',
  'ant-design:build-outlined',
  'ant-design:build-twotone',
  'ant-design:bulb-filled',
  'ant-design:bulb-outlined',
  'ant-design:bulb-twotone',
  'ant-design:calculator-filled',
  'ant-design:calculator-outlined',
  'ant-design:calculator-twotone',
  'ant-design:calendar-filled',
  'ant-design:calendar-outlined',
  'ant-design:calendar-twotone',
  'ant-design:camera-filled',
  'ant-design:camera-outlined',
  'ant-design:camera-twotone',
  'ant-design:car-filled',
  'ant-design:car-outlined',
  'ant-design:car-twotone',
  'ant-design:caret-down-filled',
  'ant-design:caret-down-outlined',
  'ant-design:caret-left-filled',
  'ant-design:caret-left-outlined',
  'ant-design:caret-right-filled',
  'ant-design:caret-right-outlined',
  'ant-design:caret-up-filled',
  'ant-design:caret-up-outlined',
  'ant-design:carry-out-filled',
  'ant-design:carry-out-outlined',
  'ant-design:carry-out-twotone',
  'ant-design:check-circle-filled',
  'ant-design:check-circle-outlined',
  'ant-design:check-circle-twotone',
  'ant-design:check-outlined',
  'ant-design:check-square-filled',
  'ant-design:check-square-outlined',
  'ant-design:check-square-twotone',
  'ant-design:chrome-filled',
  'ant-design:chrome-outlined',
  'ant-design:ci-circle-filled',
  'ant-design:ci-circle-outlined',
  'ant-design:ci-circle-twotone',
  'ant-design:ci-outlined',
  'ant-design:ci-twotone',
  'ant-design:clear-outlined',
  'ant-design:clock-circle-filled',
  'ant-design:clock-circle-outlined',
  'ant-design:clock-circle-twotone',
  'ant-design:close-circle-filled',
  'ant-design:close-circle-outlined',
  'ant-design:close-circle-twotone',
  'ant-design:close-outlined',
  'ant-design:close-square-filled',
  'ant-design:close-square-outlined',
  'ant-design:close-square-twotone',
  'ant-design:cloud-download-outlined',
  'ant-design:cloud-filled',
  'ant-design:cloud-outlined',
  'ant-design:cloud-server-outlined',
  'ant-design:cloud-sync-outlined',
  'ant-design:cloud-twotone',
  'ant-design:cloud-upload-outlined',
  'ant-design:cluster-outlined',
  'ant-design:code-filled',
  'ant-design:code-outlined',
  'ant-design:code-sandbox-circle-filled',
  'ant-design:code-sandbox-outlined',
];

const iconValue = ref('ant-design:trademark-outlined');
</script>

<template>
  <Page title="图标">
    <template #description>
      <div class="text-foreground/80 mt-2">
        图标可在
        <a
          class="text-primary"
          href="https://icon-sets.iconify.design/"
          target="_blank"
        >
          Iconify
        </a>
        中查找，支持多种图标库，如 Material Design, Font Awesome, Jam Icons 等。
      </div>
      <div class="text-foreground/80 mt-2">
        在内部添加svg或者Iconify图标后，即可在IconPicker组件中设置prefix使用。
      </div>
    </template>

    <Card class="mb-5" title="Iconify">
      <div class="flex items-center gap-5">
        <MdiGithub class="size-8" />
        <MdiGoogle class="size-8 text-red-500" />
        <MdiQqchat class="size-8 text-green-500" />
        <MdiWechat class="size-8" />
        <MdiKeyboardEsc class="size-8" />
      </div>
    </Card>

    <Card class="mb-5" title="Svg Icons">
      <div class="flex items-center gap-5">
        <SvgAvatar1Icon class="size-8" />
        <SvgAvatar2Icon class="size-8 text-red-500" />
        <SvgAvatar3Icon class="size-8 text-green-500" />
        <SvgAvatar4Icon class="size-8" />
        <SvgCakeIcon class="size-8" />
        <SvgBellIcon class="size-8" />
        <SvgCardIcon class="size-8" />
        <SvgDownloadIcon class="size-8" />
      </div>
    </Card>

    <Card class="mb-5" title="Tailwind CSS">
      <div class="flex items-center gap-5 text-3xl">
        <span class="icon-[ant-design--alipay-circle-outlined]"></span>
        <span class="icon-[ant-design--account-book-filled]"></span>
        <span class="icon-[ant-design--container-outlined]"></span>
        <span class="icon-[svg-spinners--wind-toy]"></span>
        <span class="icon-[svg-spinners--blocks-wave]"></span>
        <span class="icon-[line-md--compass-filled-loop]"></span>
      </div>
    </Card>

    <Card class="mb-5" title="图标选择器">
      <div class="mb-5 flex items-center gap-5">
        <span>只显示选择图标(svg):</span>
        <IconPicker class="w-[200px]">
          <template #trigger="{ icon }">
            <IconifyIcon
              :icon="icon || 'ant-design:appstore-filled'"
              class="text-2xl"
            />
          </template>
        </IconPicker>
      </div>
      <div class="mb-5 flex items-center gap-5">
        <span>原始样式(Iconify):</span>
        <IconPicker class="w-[200px]" />
      </div>
      <div class="mb-5 flex items-center gap-5">
        <span>原始样式(svg):</span>
        <IconPicker class="w-[200px]" prefix="svg" />
      </div>
      <div class="mb-5 flex items-center gap-5">
        <span>完整替换触发组件:</span>
        <IconPicker class="w-[200px]">
          <template #trigger="{ icon }">
            <Input
              :value="icon"
              placeholder="点击这里选择图标"
              style="width: 300px"
            >
              <template #addonAfter>
                <IconifyIcon
                  :icon="icon || 'ant-design:appstore-filled'"
                  class="text-2xl"
                />
              </template>
            </Input>
          </template>
        </IconPicker>
      </div>
      <div class="flex items-center gap-5">
        <span>可手动输入，只能点击图标打开弹窗:</span>
        <Input
          v-model:value="iconValue"
          allow-clear
          placeholder="点击这里选择图标"
          style="width: 300px"
        >
          <template #addonAfter>
            <IconPicker
              v-model="iconValue"
              :icons="iconData"
              class="w-[200px]"
              prefix=""
            >
              <template #trigger="{ icon }">
                <IconifyIcon
                  :icon="icon || 'ant-design:appstore-filled'"
                  class="text-2xl"
                />
              </template>
            </IconPicker>
          </template>
        </Input>
      </div>
    </Card>
  </Page>
</template>
