import { EmptyState } from '../flat-ui';
import { Link } from '../router';
import { SITE } from '../site';

export default function NotFound() {
  return (
    <EmptyState
      text="这一页不见了（地址写错，或者还没做）"
      action={
        <Link to="/" className="fui-btn fui-btn--primary">
          回{SITE.name}的首页
        </Link>
      }
    />
  );
}
