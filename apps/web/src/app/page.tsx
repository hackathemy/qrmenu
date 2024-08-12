import { Nav } from "@/components/nav";
import { Page } from "@/components/page";
import { Title } from "@/components/title";

export default function Home(): JSX.Element {
  return (
    <Page nav={<Nav />}>
      <Title title="Welcome" />
    </Page>
  );
}
