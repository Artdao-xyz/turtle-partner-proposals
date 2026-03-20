import ResourceHubPreviewPage, {
  generateMetadata as generateResourceHubPreviewMetadata,
} from "../../../resource-hub/preview/[previewId]/page";

export const dynamic = "force-dynamic";

export async function generateMetadata(
  props: Parameters<typeof generateResourceHubPreviewMetadata>[0]
) {
  return generateResourceHubPreviewMetadata(props);
}

export default ResourceHubPreviewPage;

