export interface Entity {
    [key: string]: any;

    "@id"?: String; //Corresponding to the IRI
    "@type"?: String;
}
