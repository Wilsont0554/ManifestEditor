import { describe, expect, it } from "vitest";
import AnnotationPage from "@/ManifestClasses/AnnotationPage";
import Annotation from "@/ManifestClasses/Annotation";

describe("AnnotationPage constructor", () => {
  it("starts with no annotations", () => {
    const page = new AnnotationPage();

    expect(page.getAllAnnotations()).toHaveLength(0);
  });

  it("has type AnnotationPage", () => {
    const page = new AnnotationPage();

    expect(page.type).toBe("AnnotationPage");
  });
});

describe("AnnotationPage.addAnnotation / getAllAnnotations", () => {
  it("stores added annotations in order", () => {
    const page = new AnnotationPage();
    const a1 = new Annotation(1);
    const a2 = new Annotation(2);

    page.addAnnotation(a1);
    page.addAnnotation(a2);

    const all = page.getAllAnnotations();
    expect(all).toHaveLength(2);
    expect(all[0]).toBe(a1);
    expect(all[1]).toBe(a2);
  });

  it("getAnnotation returns annotation at given index", () => {
    const page = new AnnotationPage();
    const a = new Annotation(1);
    page.addAnnotation(a);

    expect(page.getAnnotation(0)).toBe(a);
  });
});

describe("AnnotationPage.removeAnnotation", () => {
  it("removes the annotation at the specified index", () => {
    const page = new AnnotationPage();
    page.addAnnotation(new Annotation(1));
    page.addAnnotation(new Annotation(2));

    page.removeAnnotation(0);

    expect(page.getAllAnnotations()).toHaveLength(1);
  });

  it("does nothing for an out-of-bounds index", () => {
    const page = new AnnotationPage();
    page.addAnnotation(new Annotation(1));

    page.removeAnnotation(99);
    page.removeAnnotation(-1);

    expect(page.getAllAnnotations()).toHaveLength(1);
  });
});

describe("AnnotationPage painting vs commenting filters", () => {
  it("getPaintingAnnotations excludes commenting annotations", () => {
    const page = new AnnotationPage();
    page.addAnnotation(new Annotation(1, ["painting"]));
    page.addAnnotation(new Annotation(2, ["commenting"]));

    expect(page.getPaintingAnnotations()).toHaveLength(1);
    expect(page.getPaintingAnnotations()[0].getMotivation()).toContain("painting");
  });

  it("getCommentingAnnotations excludes painting annotations", () => {
    const page = new AnnotationPage();
    page.addAnnotation(new Annotation(1, ["painting"]));
    page.addAnnotation(new Annotation(2, ["commenting"]));

    expect(page.getCommentingAnnotations()).toHaveLength(1);
    expect(page.getCommentingAnnotations()[0].getMotivation()).toContain("commenting");
  });

  it("returns empty arrays when no annotations exist", () => {
    const page = new AnnotationPage();

    expect(page.getPaintingAnnotations()).toHaveLength(0);
    expect(page.getCommentingAnnotations()).toHaveLength(0);
  });
});

describe("AnnotationPage.clone", () => {
  it("produces an independent copy", () => {
    const page = new AnnotationPage();
    page.addAnnotation(new Annotation(1));

    const cloned = page.clone();

    expect(cloned.getAllAnnotations()).toHaveLength(1);
    expect(cloned.id).toBe(page.id);

    page.addAnnotation(new Annotation(2));
    expect(cloned.getAllAnnotations()).toHaveLength(1);
  });
});
