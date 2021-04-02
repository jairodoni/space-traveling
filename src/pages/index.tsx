import Head from 'next/head';
import Link from 'next/link';
import { FiCalendar, FiUser } from 'react-icons/fi';
import { GetStaticProps } from 'next';
import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home() {
  return (
    <>
      <Head>
        <title>Posts | space traveling</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          <Link href="/post/testepost">
            <a>
              <strong>Como aprender ReactJS</strong>
              <p>
                Mussum Ipsum, cacilds vidis litro abertis. Suco de cevadiss, é
                um leite divinis, qui tem lupuliz.
              </p>

              <div className={styles.info}>
                <FiCalendar color="#bbbbbb" />
                <time>02 de abril de 2021</time>
                <FiUser color="#bbbbbb" />
                <span>Joseph Oliveira</span>
              </div>
            </a>
          </Link>
          <Link href="/post/testepost">
            <a>
              <strong>Como aprender ReactJS</strong>
              <p>
                Mussum Ipsum, cacilds vidis litro abertis. Suco de cevadiss, é
                um leite divinis, qui tem lupuliz.
              </p>

              <div className={styles.info}>
                <FiCalendar color="#bbbbbb" />
                <time>02 de abril de 2021</time>
                <FiUser color="#bbbbbb" />
                <span>Joseph Oliveira</span>
              </div>
            </a>
          </Link>
          <Link href="/post/testepost">
            <a>
              <strong>Como aprender ReactJS</strong>
              <p>
                Mussum Ipsum, cacilds vidis litro abertis. Suco de cevadiss, é
                um leite divinis, qui tem lupuliz.
              </p>

              <div className={commonStyles.info}>
                <FiCalendar color="#bbbbbb" />
                <time>02 de abril de 2021</time>
                <FiUser color="#bbbbbb" />
                <span>Joseph Oliveira</span>
              </div>
            </a>
          </Link>
          <a href="#">Carregar mais posts</a>
        </div>
      </main>
    </>
  );
}

// export const getStaticProps = async () => {
//   // const prismic = getPrismicClient();
//   // const postsResponse = await prismic.query(TODO);

//   // TODO
// };
