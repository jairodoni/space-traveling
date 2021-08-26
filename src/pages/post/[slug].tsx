import { GetStaticPaths, GetStaticProps } from 'next';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import Head from 'next/head';
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';
import styles from './post.module.scss';
import { RichText } from 'prismic-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Prismic from '@prismicio/client';
import { useRouter } from 'next/router';
import Comments from '../../components/Comments';
import Link from 'next/link';
import { resourceLimits } from 'node:worker_threads';

interface Post {
  first_publication_date: string | null;
  last_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
  navigation: {
    prevPost: {
      uid: string;
      data: {
        title: string;
      };
    }[],
    nextPost: {
      uid: string;
      data: {
        title: string;
      };
    }[],
  };
  preview: boolean;
}

export default function Post({ post, navigation, preview }: PostProps) {
  const router = useRouter();

  if (router.isFallback) {
    return <h1>Carregando...</h1>;
  }

  const formattedDate = format(
    new Date(post.first_publication_date),
    'dd MMM yyyy',
    {
      locale: ptBR,
    }
  );

  const isPostEdited = post.first_publication_date !== post.last_publication_date;

  let editionDate;

  if (isPostEdited) {
    editionDate = format(
      new Date(post.last_publication_date),
      "'* editado em ' dd MMM yyyy ', às' H':'m",
      {
        locale: ptBR,
      }
    )
  }

  const calcWords = post.data.content.reduce((total, contentWords) => {
    total += contentWords.heading.split(' ').length;

    const words = contentWords.body.map(
      number => number.text.split(' ').length
    );
    words.map(word => (total += word));
    return total;
  }, 0);
  const calcTime = Math.ceil(calcWords / 200);

  return (
    <>
      <Head>
        <title>{post.data.title} | spacetraveling</title>
      </Head>
      <header className={styles.banner}>
        <img src={`${post.data.banner.url}`} alt="banner" />
      </header>

      <main className={styles.container}>
        {/* a tag article é usada para posts e artigos */}
        <article className={styles.post}>
          <h1>{post.data.title}</h1>
          <div className={commonStyles.info}>
            <FiCalendar color="#bbbbbb" />
            <time>{formattedDate}</time>
            <FiUser color="#bbbbbb" />
            <span>{post.data.author}</span>
            <FiClock color="#bbbbbb" />
            <span>{calcTime} min</span>
          </div>
          {isPostEdited && <span>{editionDate}</span>}
          {post.data.content.map(content => (
            <article key={content.heading} className={styles.postContent}>
              <h2>{content.heading}</h2>
              <div
                dangerouslySetInnerHTML={{
                  __html: RichText.asHtml(content.body),
                }}
              />
            </article>
          ))}

          <section className={`${styles.navigation} ${commonStyles.container}`}>
            {navigation?.prevPost.length > 0 ? (
              <div>
                <h3>{navigation.prevPost[0].data.title}</h3>
                <Link href={`/post/${navigation.prevPost[0].uid}`}>
                  Post anterior
                </Link>
              </div>
            ) : (
              <div>
                <h3></h3>
              </div>
            )}

            {navigation?.nextPost.length > 0 ? (
              <div>
                <h3>{navigation.nextPost[0].data.title}</h3>
                <Link href={`/post/${navigation.nextPost[0].uid}`}>
                  Proximo post
                </Link>
              </div>
            ) : (
              <div>
                <h3></h3>
              </div>
            )}
          </section>
        </article>
        {preview && (
          <aside>
            <Link href="/api/exit-preview">
              <a className={commonStyles.preview}>Sair do modo Preview</a>
            </Link>
          </aside>
        )}

        <Comments />
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query([
    Prismic.predicates.at('document.type', 'posts'),
  ]);

  const paths = posts.results.map(post => {
    return {
      params: {
        slug: post.uid,
      },
    };
  });

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({
  params,
  preview = false,
  previewData,
}) => {
  const prismic = getPrismicClient();
  const slug = params.slug;

  const response = await prismic.getByUID('posts', String(slug), {
    ref: previewData?.ref || null,
  });

  const prevPost = await prismic.query(
    [Prismic.Predicates.at('document.type', 'posts')],
    {
      pageSize: 1,
      after: response.id,
      orderings: '[document.first_publication_date]'
    }
  )
  const nextPost = await prismic.query(
    [Prismic.Predicates.at('document.type', 'posts')],
    {
      pageSize: 1,
      after: response.id,
      orderings: '[document.last_publication_date desc]'
    }
  )

  const post = {
    uid: response.uid,
    first_publication_date: response.first_publication_date,
    last_publication_date: response.last_publication_date,
    data: {
      title: response.data.title,
      subtitle: response.data.subtitle,
      author: response.data.author,
      banner: {
        url: response.data.banner.url,
      },
      content: response.data.content.map(content => {
        return {
          heading: content.heading,
          body: [...content.body],
        };
      }),
    },
  };

  return {
    props: {
      post,
      navigation: {
        prevPost: prevPost?.results,
        nextPost: nextPost?.results,
      },
      preview,
    },
  };
};
