import { DialogState } from "src/app/core/shared/models/core.types";
import { ButtonRole } from "./app.types";


export interface ModalButton {
  role: ButtonRole;
  text: string;
  disable: boolean;
  color: 'danger' | 'primary' | 'secondary' | 'tertiary';
  goto?: DialogState;
}

export interface NetworkMessage {
  isOnlineMode: boolean;
  status:
  'mobile-online' |
  'mobile-offline' |
  'mobile-connected-unauthorized' |
  'mobile-disconnected-unauthorized' |
  'wifi-online' |
  'wifi-offline' |
  'no-network-avaliable';
}
