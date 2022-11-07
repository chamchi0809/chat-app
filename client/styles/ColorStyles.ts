
import oc from 'open-color';

export type styledColor = Exclude<keyof oc, 'black'|'white'>;
