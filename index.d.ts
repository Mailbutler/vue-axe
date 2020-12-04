import { ElementContext as AxeElementContext, RunOptions as AxeRunOptions, Spec as AxeSpec } from 'axe-core';
import { PluginFunction } from 'vue';

export interface RunOptions {
  clearConsole: boolean;
  element: Document | HTMLElement;
}

export interface VueAxeStyle {
  head?: string;
  boldCourier?: string;
  moderate?: string;
  critical?: string;
  serious?: string;
  minor?: string;
  title?: string;
  url?: string;
}

export interface VueAxeOptions {
  /**
   * Disables automatic verification. Only checks with $axe.run
   */
  auto?: boolean;
  /**
   * Clears the console each time vue-axe runs
   */
  clearConsoleOnUpdate?: boolean;
  /**
   * Provide your Axe-core configuration
   */
  config?: AxeSpec;
  /**
   * Provide your Axe-core runtime options
   */
  runOptions?: AxeRunOptions;
  /**
   * Used to delay the first check. - `Millisecond`
   */
  delay?: number;
  /**
   * 
   */
  style?: VueAxeStyle;
  /**
   * Register Axe plugins
   */
  plugins?: any[];
  /**
   * Custom context for initial audit (defaults to `document`)
   */
  customInitialContext?: AxeElementContext;
  /** 
   * Handle the results. (This may be needed for automated tests)
   */
  customResultHandler?: (error: any, results: any) => any;
}

export interface VueAxe {
  run(options: RunOptions): void;
  plugins: Record<string, any>;
}

declare module 'vue/types/vue' {
  interface Vue {
    $axe: VueAxe;
  }
}

declare class VueAxePlugin {
  static install: PluginFunction<VueAxeOptions>;
}

export default VueAxePlugin;
