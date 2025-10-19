# Deployment Guide

## Quick Deploy to Vercel

### 1. Prerequisites
- GitHub repository with your code
- [Vercel account](https://vercel.com) (free)
- OpenAI API key from [platform.openai.com](https://platform.openai.com/api-keys)

### 2. Deploy Steps

#### Option A: Deploy via Vercel Dashboard

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Migrate to Next.js with OpenAI Agents SDK"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Click "Import Git Repository"
   - Select your repository
   - Click "Import"

3. **Configure Environment Variables**
   - In the "Configure Project" screen, expand "Environment Variables"
   - Add:
     - **Name**: `OPENAI_API_KEY`
     - **Value**: Your OpenAI API key (starts with `sk-proj-...`)
   - Click "Deploy"

4. **Done!** 🎉
   - Your site will be live in ~2 minutes
   - Vercel will give you a URL like `your-project.vercel.app`

#### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts to:
# 1. Link to existing project or create new
# 2. Add OPENAI_API_KEY when prompted
# 3. Deploy!

# Deploy to production
vercel --prod
```

### 3. Add Custom Domain (Optional)

1. Go to your Vercel project settings
2. Click "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

## Environment Variables

### Required
- `OPENAI_API_KEY` - Your OpenAI API key (get from [platform.openai.com](https://platform.openai.com/api-keys))

### Optional (for future enhancements)
- `RATE_LIMIT_MAX` - Max requests per minute per IP (default: 10)
- `SESSION_TIMEOUT` - Session timeout in minutes (default: 60)

## Production Considerations

### 1. Session Storage
The current implementation uses in-memory session storage. For production:

**Option A: Vercel KV (Redis)**
```bash
npm install @vercel/kv
```

Update `app/api/chat/route.ts`:
```typescript
import { kv } from '@vercel/kv'

// Replace Map with KV
const getSession = async (sessionId: string) => {
  return await kv.get(`session:${sessionId}`) || []
}

const setSession = async (sessionId: string, history: any[]) => {
  await kv.setex(`session:${sessionId}`, 3600, history) // 1 hour expiry
}
```

**Option B: Vercel Postgres**
```bash
npm install @vercel/postgres
```

### 2. Rate Limiting
Install rate limiting to prevent abuse:

```bash
npm install @upstash/ratelimit @upstash/redis
```

Add to `app/api/chat/route.ts`:
```typescript
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 m'),
})

// In POST handler
const identifier = request.ip ?? 'anonymous'
const { success } = await ratelimit.limit(identifier)

if (!success) {
  return new Response('Too many requests', { status: 429 })
}
```

### 3. Error Monitoring
Add error tracking:

```bash
npm install @sentry/nextjs
```

Configure Sentry:
```bash
npx @sentry/wizard -i nextjs
```

### 4. Analytics
Add Vercel Analytics:

```bash
npm install @vercel/analytics
```

Update `app/layout.tsx`:
```typescript
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

## Monitoring

### Vercel Dashboard
- View deployment logs
- Monitor function execution
- Check error rates
- View analytics

### OpenAI Usage
- Monitor API usage at [platform.openai.com/usage](https://platform.openai.com/usage)
- Set usage limits to prevent unexpected charges
- Track token consumption

## Performance Optimization

### Edge Runtime
The API route runs on Edge by default for lower latency. If you need Node.js runtime:

```typescript
// app/api/chat/route.ts
export const runtime = 'nodejs' // or 'edge' (default)
```

### Caching
Add caching for static responses:

```typescript
export const revalidate = 60 // Cache for 60 seconds
```

## Costs

### Free Tier Includes
- **Vercel**: 100GB bandwidth/month, unlimited deployments
- **OpenAI**: Pay-as-you-go (starts at $0)

### Estimated Costs (moderate usage)
- **Vercel**: Free (unless >100GB bandwidth)
- **OpenAI GPT-4**: ~$0.01-0.03 per conversation
- **Vercel KV**: $0.30/100K requests (optional)

## Troubleshooting

### Deployment Fails
1. Check build logs in Vercel dashboard
2. Run `npm run build` locally to test
3. Verify all environment variables are set

### API Errors
1. Check Vercel function logs
2. Verify `OPENAI_API_KEY` is correct
3. Check OpenAI API status

### Streaming Not Working
1. Ensure using Edge runtime
2. Check browser console for errors
3. Verify API key has proper permissions

## Security Checklist

- [ ] API key is set as environment variable (not in code)
- [ ] `.env.local` is in `.gitignore`
- [ ] Rate limiting is configured
- [ ] Input validation is in place
- [ ] Error messages don't leak sensitive data
- [ ] CORS is configured for production domain

## Post-Deployment

1. **Test the deployment**
   - Visit your Vercel URL
   - Try the chat interface
   - Check streaming works properly

2. **Monitor usage**
   - Check Vercel analytics
   - Monitor OpenAI usage
   - Set up alerts for errors

3. **Optimize**
   - Add rate limiting
   - Implement session persistence
   - Add analytics
   - Consider caching

## Support

- [Next.js Docs](https://nextjs.org/docs)
- [Vercel Support](https://vercel.com/support)
- [OpenAI Help](https://help.openai.com)

---

Need help? Check the [MIGRATION.md](MIGRATION.md) for technical details or open an issue in the repository.
