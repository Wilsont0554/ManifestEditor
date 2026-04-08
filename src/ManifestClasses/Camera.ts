import ContentResource from "./ContentResource.ts";

const cameraContentResourceTypeSet = new Set([
    "OrthographicCamera",
    "PerspectiveCamera",
]);

export type CameraContentResourceType = "OrthographicCamera" | "PerspectiveCamera";

function normalizeCameraType(type: string): CameraContentResourceType {
    if (type === "PerspectiveCamera") {
        return "PerspectiveCamera";
    }

    return "OrthographicCamera";
}

class Camera extends ContentResource {
    near?: number;
    far?: number;
    viewHeight?: number;
    fieldOfView?: number;

    constructor(id: string, type: CameraContentResourceType = "OrthographicCamera") {
        super(id, normalizeCameraType(type), undefined);
        this.setType(type);
    }

    static isCameraType(type: string): type is CameraContentResourceType {
        return cameraContentResourceTypeSet.has(type);
    }

    override setType(type: string): void {
        const normalizedType = normalizeCameraType(type);

        super.setType(normalizedType);

        if (normalizedType === "OrthographicCamera") {
            this.fieldOfView = undefined;
            this.viewHeight ??= 0;
            return;
        }

        this.viewHeight = undefined;
        this.fieldOfView ??= 0;
    }

    override getType(): CameraContentResourceType {
        return normalizeCameraType(super.getType());
    }

    setAllCameraValues(newCamera: Camera): void{
        try{
            this.setAllValues(newCamera);
            this.near = newCamera.near;
            this.far = newCamera.far;
            this.fieldOfView = newCamera.fieldOfView;
        }catch(e){
            console.log(e);
        }
    }

    setNear(near?: number): void {
        this.near = near;
    }

    getNear(): number | undefined {
        return this.near;
    }

    removeNear(): void {
        this.near = undefined;
    }

    setFar(far?: number): void {
        this.far = far;
    }

    getFar(): number | undefined {
        return this.far;
    }

    removeFar(): void {
        this.far = undefined;
    }

    setViewHeight(viewHeight?: number): void {
        this.viewHeight = viewHeight;
    }

    getViewHeight(): number | undefined {
        return this.viewHeight;
    }

    removeViewHeight(): void {
        this.viewHeight = undefined;
    }

    setFieldOfView(fieldOfView?: number): void {
        this.fieldOfView = fieldOfView;
    }

    getFieldOfView(): number | undefined {
        return this.fieldOfView;
    }

    removeFieldOfView(): void {
        this.fieldOfView = undefined;
    }
}

export default Camera;
