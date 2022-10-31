
import oc from 'open-color';

export type styledColor = Omit<keyof oc, 'black'|'white'>;


const co : styledColor = ''