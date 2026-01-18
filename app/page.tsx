import PostManager from "@/components/PostManager";
import { ShareButton } from "@/components/share/share-button";

export default function Home() {
  return (
    <>
      <ShareButton
        url="https://yoursite.com/post/123"
        title="Amazing Blog Post"
        text="Check out this awesome post!"
        variant="default"
      />

      {/*<PostManager />*/}
    </>
  );
}
