export declare enum SignatureMethod {
    DRAWN = "drawn",
    UPLOADED = "uploaded"
}
export declare class CaptureSignatureDto {
    signatureData: string;
    signatureMethod: SignatureMethod;
    signatureMetadata?: Record<string, any>;
}
