import IUser from "./Iuser";
import { IPropiedad } from "./Properties";
export interface IReview {
    id: string;         
    user: IUser;    
    property: IPropiedad;  
    reviewDate: string;   
    comment: string;     
    rating: number;       
  }